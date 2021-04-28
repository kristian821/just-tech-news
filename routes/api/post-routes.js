const router = require('express').Router();
const { Post, User } = require('../../models');

// GET all posts
router.get('/', (req, res) => {
    console.log('====================');
    Post.findAll({
        attributes: ['id', 'post_url', 'title', 'created_at'],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(e => {
        console.log(e);
        res.status(500).json(e);
    });
});

// GET a single post
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [ 'id', 'post_url', 'title', 'created_at'],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: "No post found with this id" });
            return;
        }
        res.json(dbPostData);
    })
    .catch (e => {
        console.log(e);
        res.status(500).json(e);
    }) 
});

// Create a post
router.post('/', (req, res) => {
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
    .then(dbPostData => {
        res.json(dbPostData)
    })
    .catch(e => {
        console.log(e);
        res.status(500).json(e);
    });
});

// Update a post
router.put('/:id', (req, res) => {
    Post.update({
            title: req.body.title,
        },
        {
            where: {
                id: req.params.id
        }
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: "No Post was found with this id" });
            return;
        }
        res.json(dbPostData);
    })
    .catch(e => {
        res.status(500).json(e);
    });
});

// DELETE a post
router.delete('/:id', (req, res) => {
    Post.delete({
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: "No post with this id was found" });
            return;
        }
        res.json(dbPostData);
    })
    .catch(e => {
        console.log(e);
        res.status(500).json(e);
    });
});

module.exports = router;