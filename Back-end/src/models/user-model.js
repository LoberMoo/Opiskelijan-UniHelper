import promisePool from '../utils/database.js';



// GET /api/users - list all users
// Unused other than for test requests, not in the final iteration
const getUsers = async () => {
  try {
  const [rows] = await promisePool.query('SELECT username from users;');
  return rows;

  } catch (error) {
    console.error('error', error.message);
    return {error: error.message};
  }
};

// get /api/users/:ID - get user by id
const getUserbyId = async (id) => {
  try {
  const [rows] = await promisePool.execute('SELECT username from users where user_id = ?', [id]);
  //console.log('rows', rows);
  return rows[0];

  } catch (error) {
    console.error('error', error.message);
    return {error: error.message};
  }
};
// POST /api/users - add a new user
const addUser = async (user) => {
  const {username, password, email} = user;
  const sqlhaku = `INSERT INTO users (username, password, email)
  VALUES (?, ?, ?)`;
  const params = [username, password, email];
  try {
    const result = await promisePool.execute(sqlhaku, params);
    return {user_id: result[0].insertId};
  } catch (e) {
    console.error('virhe', e.message);
    return {error: e.message}
  };
}

// Unused other than for test requests, not in the final iteration
const findUserByUsername = async (username) => {
  const sql = 'SELECT * FROM Users WHERE username = ?';
  const [rows] = await promisePool.execute(sql, [username]);
  return rows[0];
};

 const selectUserByEmail = async (email) => {
   try {
     const sql = 'SELECT * FROM Users WHERE email = ?';
     const params = [email];
     const [rows] = await promisePool.query(sql, params);
     // console.log(rows);
     // if nothing is found with the user id, result array is empty []
     if (rows.length === 0) {
       return {error: 404, message: 'user not found'};
     }
     // Remove password property from result
     delete rows[0].password;
     return rows[0];
   } catch (error) {
     console.error('selectUserByEmail', error);
     return {error: 500, message: 'db error'};
   }
 };

export {findUserByUsername, getUsers, getUserbyId, addUser, selectUserByEmail};
