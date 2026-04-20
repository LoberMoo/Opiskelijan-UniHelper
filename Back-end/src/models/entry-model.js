import promisePool from '../utils/database.js';

const listAllEntries = async (user_id) => {
  console.log(user_id)
  try {
    const sql = 'SELECT * FROM diaryentries WHERE user_id = ?;'
    const [rows] = await promisePool.execute(sql, [user_id]);
    return rows;
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const findEntryById = async (id) => {
  try {
    // prepared statement
    const [rows] = await promisePool.execute('SELECT * FROM diaryentries WHERE entry_id = ?', [id]);
    return rows[0];
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const addEntry = async (entry) => {
  const {user_id, entry_date, mood, weight, sleep_hours, notes} = entry;
  const sql = `INSERT INTO DiaryEntries (user_id, entry_date, mood, weight, sleep_hours, notes)
               VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [user_id, entry_date, mood, weight, sleep_hours, notes];
  try {
    const rows = await promisePool.execute(sql, params);
    // console.log('rows', rows);
    return {entry_id: rows[0].insertId};
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const removeEntryById = async(entryId, userId) => {
  const sqlhaku = 'delete from diaryEntries where entry_id = ? and user_id = ?';
  const [tulos] = await promisePool.execute(sqlhaku, [entryId, userId]);
  return tulos.affectedRows;
}

export {listAllEntries, findEntryById, addEntry, removeEntryById};
