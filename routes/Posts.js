const express = require('express');
const router = express.Router();
const {Posts, Likes} = require('../models');
const {validateToken} = require('../middlewares/AuthMiddleware');

router.get('/', validateToken, async (req, res) => {
  try {
    const ListofPosts = await Posts.findAll({include: [Likes]}); //join both table like table
    const ListofLikes = await Likes.findAll({where: {UserId: req.user.id}});
    res.json({ListofPosts: ListofPosts, ListofLikes: ListofLikes});
  } catch (error) {
    res.send(error);
  }
});

router.get('/byId/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Posts.findByPk(id); //primary key
    res.json(post);
  } catch (error) {
    res.send(error);
  }
});

router.get('/byuserId/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const listofPosts = await Posts.findAll({
      where: {UserId: id},
      include: [Likes],
    }); //primary key
    res.json(listofPosts);
  } catch (error) {
    res.send(error);
  }
});

router.post('/', validateToken, async (req, res) => {
  //everything should be async in sequelize
  try {
    const post = req.body; //call the data in body
    post.username = req.user.username; //validateTOken
    post.UserId = req.user.id; //validateTOken
    await Posts.create(post); //call sequilize & insert into database
    res.json(post); //return all data
  } catch (error) {
    res.send(error);
  }
});
router.put('/title', validateToken, async (req, res) => {
  try {
    const {title, id} = req.body;

    await Posts.update({title: newtitle}, {where: {id: id}});
    res.json(newtitle);
  } catch (error) {
    res.send(error);
  }
});
router.put('/postText', validateToken, async (req, res) => {
  try {
    const {newText, id} = req.body;

    await Posts.update({postText: newText}, {where: {id: id}});
    res.json(newText);
  } catch (error) {
    res.send(error);
  }
});
router.delete('/:postId', validateToken, async (req, res) => {
  try {
    const postId = req.params.postId;
    await Posts.destroy({where: {id: postId}});
    res.json('deleted');
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
