import {listAllEntries, findEntryById, addEntry, removeEntryById} from "../models/entry-model.js";

const getEntries = async (req, res) => {
  const result = await listAllEntries(req.user.user_id);
  if (!result.error) {
    res.json(result);
  } else {
    res.status(500);
    res.json(result);
  }
};

const getEntryById = async (req, res) => {
  const entry = await findEntryById(req.params.id);
  if (entry) {
    res.json(entry);
  } else {
    res.sendStatus(404);
  }
};

const postEntry = async (req, res) => {
  const {entry_date, mood, weight, sleep_hours, notes} = req.body;
  const user_id = req.user.user_id;

  if (entry_date && (weight || mood || sleep_hours || notes) && user_id) {
    const result = await addEntry({user_id, ...req.body});

    if (result.entry_id) {
      res.status(201);
      res.json({message: 'New entry added.', ...result});
    } else {
      res.status(500);
      res.json(result);
    }
  } else {
    res.sendStatus(400);
  }
};

const putEntry = (req, res) => {
  // placeholder for future implementation
  res.sendStatus(200);
};

const deleteEntry = async (req, res) => {
  const affectedRows = await removeEntryById(req.params.id, req.user.user_id);
  if (affectedRows > 0) {
    res.json({message: 'Entry poistettu'});
  } else {
    res.status(404).json({message: 'Entryä ei löytynyt'});
  }
};

export {getEntries, getEntryById, postEntry, putEntry, deleteEntry};
