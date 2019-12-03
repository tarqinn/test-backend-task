const express = require('express');
const router = express.Router();

const UserModel = require('../models/user.model');

router.get('/page/:skip', async function(req, res) {
  const userList = await UserModel.find({}).select(
    'checked firstName lastName role businessLocation workEmail workPhone hourlyRate'
  ).skip(parseInt(req.params.skip)).limit(5).sort({
    _id: 'asc'
});

  if (!userList || userList.length === 0) {
    res.status(404).send({ message: 'Users not found' });
    return;
  }

  return res.status(200).send(userList);
});

/* GET users listing. */
router.get('/:id', async function(req, res) {
  const { params } = req;
  const user = await UserModel.findOne({ _id: params.id });

  if (!user) {
    res.status(404).send({ message: 'User not found' });
    return;
  }
  res.status(200).send(user);
});

router.post('/create', async function(req, res) {
  const {
    checked,
    // userId,
    firstName,
    lastName,
    login,
    workPhone,
    personalPhone,
    workEmail,
    personalEmail,
    businessLocation,
    company,
    role,
    hourlyRate
  } = req.body;

  const user = await new UserModel({
    checked,
    // userId,
    firstName,
    lastName,
    login,
    workPhone,
    personalPhone,
    workEmail,
    personalEmail,
    businessLocation,
    company,
    role,
    hourlyRate
  })
    .save()
    .catch(err => {
      console.log(err);
    });

  return res.status(200).send(user);
});

router.post('/edit/:id', async function(req, res) {
  const { id: _id } = req.params;
  const result = await UserModel.findOneAndUpdate({ _id }, req.body, {
    new: true
  });

  if (!result) {
    res.status(404).send({ message: 'User not found' });
    return;
  }

  return res.status(200).send(result);
});

router.post('/remove/:id', async function(req, res) {
  const { id: _id } = req.params;
  const result = await UserModel.findOneAndDelete({ _id });

  if (!result) {
    res.status(404).send({ message: 'User not found' });
    return;
  }

  return res.status(200).send(result);
});

module.exports = router;
