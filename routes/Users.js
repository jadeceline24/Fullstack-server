const express = require('express');
const router = express.Router();
const {Users} = require('../models');
const bcrypt = require('bcrypt'); //alternative bcrypt JS 
const {sign} = require('jsonwebtoken'); //generate the token
const {validateToken} = require('../middlewares/AuthMiddleware');

router.post('/', async (req, res) => {
  try {
    const {username, password} = req.body;
    bcrypt.hash(password, 10).then((hash) => {
      Users.create({username: username, password: hash});
    });
    res.json('Login');
  } catch (error) {
    res.send(error);
  }
});
router.post('/login', async (req, res) => {
  try {
    const {username, password} = req.body;
    const user = await Users.findOne({where: {username: username}});
    if (!user) {
      res.json({error: 'User not found'});
    } else {
      bcrypt.compare(password, user.password).then((match) => {
        if (!match) {
          res.json({error: 'Wrong username and password'});
        } else {
          const accessToken = sign(
            {username: user.username, id: user.id},
            'importantsecret',
          ); //you want to be a token
          res.json({token: accessToken, username: username, id: user.id}); //sent token to the frontend
        }
      });
    }
  } catch (error) {
    res.send(error);
  }
});
router.get('/auth', validateToken, (req, res) => {
  //endpoint chekc if aut or not
  res.json(req.user);
});

router.get('/basicInfo/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const basicInfo = await Users.findByPk(id, {
      attributes: {exclude: ['password']},
    });
    res.json(basicInfo);
  } catch (error) {
    res.send(error);
  }
});

router.put('/changepass', validateToken, async (req, res) => {
  try {
    const {oldPassword, newPassword} = req.body;
    const user = await Users.findOne({where: {username: req.user.username}});

    bcrypt.compare(oldPassword, user.password).then(async (match) => {
      if (!match) res.json({error: 'Wrong password'});

      bcrypt.hash(newPassword, 10).then((hash) => {
        Users.update({password: hash}, {where: {username: req.user.username}});
        res.json('Success');
      });
    });
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
