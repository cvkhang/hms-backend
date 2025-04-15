
// Thêm phòng mới
const CREATE_ROOM = `
  INSERT INTO rooms (room_number, room_floor, room_facility, status, room_type_id)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;
`;

// Lấy danh sách phòng
const GET_ROOMS = `
  SELECT * 
  FROM rooms
  ORDER BY room_id ASC;
`;

// Cập nhật phòng
const UPDATE_ROOM = `
  UPDATE rooms
  SET 
    room_number   = $1,
    room_floor    = $2,
    room_facility = $3,
    status        = $4,
    room_type_id  = $5
  WHERE room_id = $6
  RETURNING *;
`;

// Cập nhật trạng thái phòng
const UPDATE_ROOM_STATUS = `
  UPDATE rooms
  SET status = $1
  WHERE room_id = $2
  RETURNING *;
`;

// Xóa phòng
const DELETE_ROOM = `
  DELETE FROM rooms
  WHERE room_id = $1
  RETURNING *;
`;

module.exports = {
  CREATE_ROOM,
  GET_ROOMS,
  UPDATE_ROOM,
  DELETE_ROOM,
  UPDATE_ROOM_STATUS
};
