const express = require('express');
const db = require('./db'); 
const queries = require('./queries'); 
const serverless = require("serverless-http");

const app = express();
const port = 3000;

// Export the serverless handler
module.exports.handler = serverless(app);

app.get('/', (req, res) => {
  res.send('Hello World!'); 
});

app.use(express.json());

/*
  API Endpoint: POST /api/rooms
  Thêm phòng mới
  Body mẫu (JSON):
  {
    "room_number": "101",
    "room_floor": "1st Floor",
    "room_facility": "TV, Điều hòa",
    "status": "vacant",
    "room_type_id": 1
  }
*/
app.post('/api/rooms', async (req, res) => {
  try {
    const { room_number, room_floor, room_facility, status, room_type_id } = req.body;
    const values = [room_number, room_floor, room_facility, status, room_type_id];

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
  API Endpoint: PUT /api/rooms/:id
  Cập nhật thông tin phòng
  Body mẫu (JSON):
  {
    "room_number": "101",
    "room_floor": "1st Floor",
    "room_facility": "TV, Điều hòa",
    "status": "vacant",
    "room_type_id": 1
  }
*/
app.put('/api/rooms/:id', async (req, res) => {
  try {
    const { id } = req.params;  // room_id
    const { room_number, room_floor, room_facility, status, room_type_id } = req.body;

    const values = [room_number, room_floor, room_facility, status, room_type_id, id];
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
  API Endpoint: PATCH /api/rooms/:id/status
  Cập nhật trạng thái phòng.
  Body mẫu (JSON):
  {
    "status": "occupied"
  }
*/
app.patch('/api/rooms/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await db.query(queries.UPDATE_ROOM_STATUS, [status, id]);

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
