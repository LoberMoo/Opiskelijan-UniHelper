import bcrypt from 'bcryptjs';
import { findUserByUsername, getUsers, getUserbyId, addUser } from "../models/user-model.js";
import jwt from 'jsonwebtoken';

//TODO: Fix everything I guess?
// Get users?

const haeuserit = async (req, res) => {
  const result = await getUsers();
  if (!result.error) {
    res.json(result);
  } else {
    res.status(500);
    res.json(result);
  }
};

// Hae käyttäjä ID:n perusteella
const haeuserbyId = async (req, res) => {
  const result = await getUserbyId(req.params.id);
  if (result) {
    res.json(result);
  } else {
    res.status(404);
  };
};

// post user
const postUser = async (pyynto, vastaus) => {
  const newUser = pyynto.body;

  // Salasanan tiivisteen laskenta
  const hash = await bcrypt.hash(newUser.password, 10);
  // Korvataan selkeäkielinen salasana tiivisteellä (hashilla) ennen tallennusta tietokantaan
  newUser.password = hash;
  const newUserId = await addUser(newUser);
  vastaus.status(201).json({message: 'new user added', user_id: newUserId});
};

const oldpostLogin = async (req, res) => {
  const {username, password} = req.body;
  const user = await findUserByUsername(username);
  if (user) {
    if (await bcrypt.compare(password, user.password)) {
      delete user.password;
      const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      return res.json({message: 'login ok', user, token});
    }
    return res.status(403).json({error: 'invalid password'});
  }
  res.status(404).json({error: 'user not found'});
};

const oldgetMe = (req, res) => {
  res.json(req.user);
};

export {haeuserit, postUser, oldpostLogin, oldgetMe, haeuserbyId};
