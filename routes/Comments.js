const express = require('express');
const router = express.Router();
const {Comments} = require('../models');
const {validateToken} = require('../middlewares/AuthMiddleware');

router.get('/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await Comments.findAll({where: {PostId: postId}});
    res.json(comments);
  } catch (error) {
    res.send(error);
  }
});
router.post('/', validateToken, async (req, res) => {
  try {
    const comment = req.body;

    const username = req.user.username; //passing req user from validtoken
    comment.username = username;
    const createComment = await Comments.create(comment); //primary key
    res.json(createComment);
  } catch (error) {
    res.send(error);
  }
});

router.delete('/:commentId', validateToken, async (req, res) => {
  try {
    const commentId = req.params.commentId;

    await Comments.destroy({where: {id: commentId}});
    res.json("deleted Comment");
  } catch (error) {
    res.send(error);
  }
});
module.exports = router;
