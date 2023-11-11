const router = require('express').Router();
const { Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No posts found with this id!' });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/comment', async (req, res) => {
  try {
    const { post_id, comment_text } = req.body;

    const newComment = await Comment.create({
      post_id,
      user_id: req.session.user_id,
      text: comment_text,
    });


    res.redirect(`/post/${post_id}`);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

module.exports = router;
