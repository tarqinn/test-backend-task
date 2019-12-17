const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const AuthModel = require('../models/auth.model');
const TokenModel = require('../models/token.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post('/register', async (req, res) => {
  const { login, pass, role } = req.body;

  const hashedPass = await bcrypt.hash(pass, saltRounds).catch(err => err);

  const user = await new AuthModel({
    login,
    pass: hashedPass,
    role
  })
    .save()
    .catch(err => {
      console.log(err);
    });

  return res.status(200).send(user);
});

router.post('/login', async (req, res) => {
  const { login, pass } = req.body;

  const currentUser = await AuthModel.findOne({ login }).catch(err => err);

  if (!currentUser || currentUser.message) {
    res.status(401).send({ message: "login doesn't exist" });
    return;
  }

  const { _id, role } = currentUser;
  const result = await bcrypt.compare(pass, currentUser.pass);
  const AutorizationToken = await jwt.sign(
    { _id, role },
    Buffer.from(process.env.SECRET, 'base64'),
    { expiresIn: process.env.AUTH_TOKEN_LIFE }
  );
  const RefreshToken = await jwt.sign(
    { _id },
    Buffer.from(process.env.SECRET, 'base64'),
    { expiresIn: process.env.REFRESH_TOKEN_LIFE }
  );

  await new TokenModel({
    token: RefreshToken,
    userId: _id
  })
    .save()
    .catch(err => {
      console.log(err);
    });

  if (result) {
    res.status(200).send({ AutorizationToken, RefreshToken });
  } else {
    res.status(401).send({ message: 'password is incorrect' });
  }
});

router.post('/send-new-tokens', async (req, res) => {
  const { refreshToken } = req.body;
  const { _id } = jwt.decode(refreshToken);
  const { role } = await AuthModel.findOne({ _id }).catch(err => err);
  const AutorizationToken = await jwt.sign(
    { _id, role },
    Buffer.from(process.env.SECRET, 'base64'),
    { expiresIn: process.env.AUTH_TOKEN_LIFE }
  );
  const RefreshToken = await jwt.sign(
    { _id },
    Buffer.from(process.env.SECRET, 'base64'),
    { expiresIn: process.env.REFRESH_TOKEN_LIFE }
  );
  const result = await TokenModel.findOneAndDelete({
    token: refreshToken
  }).catch(err => err);
  if (result && _id === result.userId && Date.now() < parseInt(exp + '000')) {
    res.status(200).send({ AutorizationToken, RefreshToken });
  } else {
    res.status(401).send({ message: 'Invalid refresh token' });
  }
});

router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body;
  const { _id } = jwt.decode(refreshToken);
  const userTokens = await TokenModel.deleteMany({ userId: _id });
  userTokens ? res.status(200).send({message: 'Logout Successful'}) : res.status(401).send({ message: 'Invalid refresh token' });
});

module.exports = router;
