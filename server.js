const express = require('express');
const db = require('./db'); 
const queries = require('./queries'); 

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!'); 
});

app.use(express.json());

/*
  API Endpoint: POST /api/rooms
  Chức năng: Thêm phòng mới vào hệ thống

  Request body (JSON mẫu):
  {
    "type_id": "1",
    "room_number": "101",
    "bed_type": "Queen",
    "room_floor": "1st Floor",
    "room_facility": "TV, Điều hòa",
    "room_status": "Available"
  }

  Giải thích:
  - type_id: ID của loại phòng (tham chiếu đến bảng RoomTypes)
  - room_number: Số phòng (phải là duy nhất)
  - bed_type: Loại giường (Queen, Twin, King, Triple, Quad)
  - room_floor: Tầng phòng (ví dụ: 1st)
  - room_facility: Các tiện nghi đi kèm (ví dụ: TV, Điều hòa)
  - room_status: Trạng thái phòng (Available, Booked, Reserved, Waitlist, Blocked)

*/

app.post('/api/rooms', async (req, res) => {
  try {
    const { type_id, room_number, bed_type, room_floor, room_facility, room_status } = req.body;
    const values = [type_id, room_number, bed_type, room_floor, room_facility, room_status];

    const result = await db.query(queries.CREATE_ROOM, values);
    return res.status(201).json({
      message: 'Thêm phòng thành công!',
      room: result.rows[0],
    });
  } catch (error) {
    console.error('Lỗi khi thêm phòng:', error);
    return res.status(500).json({ error: 'Lỗi server khi thêm phòng.' });
  }
});


/*
  API Endpoint: GET /api/rooms
  Lấy danh sách phòng
*/
app.get('/api/rooms', async (req, res) => {
  try {
    const result = await db.query(queries.GET_ROOMS);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách phòng:', error);
    return res.status(500).json({ error: 'Lỗi server khi lấy danh sách phòng.' });
  }
});


/*
  API Endpoint: PUT /api/rooms/:room_id
  Chức năng: Cập nhật thông tin phòng theo room_id

  Request params:
  - room_id: ID của phòng cần cập nhật (lấy từ URL params)

  Request body (JSON mẫu):
  {
    "type_id": "1",
    "room_number": "101",
    "bed_type": "Queen",
    "room_floor": "1st Floor",
    "room_facility": "TV, Điều hòa",
    "room_status": "Available"
  }

  Giải thích:
  - type_id: ID loại phòng (tham chiếu đến bảng RoomTypes)
  - room_number: Số phòng
  - bed_type: Loại giường
  - room_floor: Tầng phòng
  - room_facility: Tiện nghi trong phòng
  - room_status: Trạng thái phòng (Available, Booked, Reserved, Waitlist, Blocked)

  Phản hồi:
  - 200 OK: Nếu cập nhật thành công, trả về thông báo và thông tin phòng vừa được cập nhật.
  - 404 Not Found: Nếu không tìm thấy phòng với room_id được cung cấp.
  - 500 Internal Server Error: Nếu có lỗi xảy ra trong quá trình xử lý.
*/
app.put('/api/rooms/:room_id', async (req, res) => {
  try {
    const { room_id } = req.params;  // room_id
    const { type_id, room_number, bed_type, room_floor, room_facility, room_status } = req.body;

    const values = [room_id, type_id, room_number, bed_type, room_floor, room_facility, room_status];
    const result = await db.query(queries.UPDATE_ROOM, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Phòng không tồn tại.' });
    }

    return res.status(200).json({
      message: 'Cập nhật phòng thành công!',
      room: result.rows[0],
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật phòng:', error);
    return res.status(500).json({ error: 'Lỗi server khi cập nhật phòng.' });
  }
});


/*
  API Endpoint: DELETE /api/rooms/:id
  Xóa phòng
*/
app.delete('/api/rooms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(queries.DELETE_ROOM, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Phòng không tồn tại.' });
    }
    return res.status(200).json({ message: 'Xóa phòng thành công!' });
  } catch (error) {
    console.error('Lỗi khi xóa phòng:', error);
    return res.status(500).json({ error: 'Lỗi server khi xóa phòng.' });
  }
});

/*
  API Endpoint: PATCH /api/rooms/:room_id/room_status
  Cập nhật trạng thái phòng.
  Body mẫu (JSON):
  {
    "room_status": "Available" (Available, Booked, Reserved, Waitlist, Blocked)
  }
*/
app.patch('/api/rooms/:room_id/room_status', async (req, res) => {
  try {
    const { room_id } = req.params;
    const { room_status } = req.body;

    const result = await db.query(queries.UPDATE_ROOM_STATUS, [room_id, room_status]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Phòng không tồn tại.' });
    }

    return res.status(200).json({
      message: 'Trạng thái phòng đã được cập nhật thành công!',
      room: result.rows[0],
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái phòng:', error);
    return res.status(500).json({ error: 'Lỗi server khi cập nhật trạng thái phòng.' });
  }
});

app.listen(port, () => {
  console.log(`Server running http://localhost:${port}`);
});
