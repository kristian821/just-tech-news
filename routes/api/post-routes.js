const router = require('express').Router();
const { Post, User, Vote, Comment } = require('../../models');
const sequelize = require('../../config/connection');

// GET all posts
router.get('/', (req, res) => {
    console.log('====================');
    Post.findAll({
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal(`(SELECT COUNT(*) FROM vote WHERE post.id = vote.id = vote.post_id)`), 'vote_count']
        ],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
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
        attributes: [ 'id', 'post_url', 'title', 'created_at', [sequelize.literal(`(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)`), 'vote_count']],
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

// PUT /api/posts/upvote
router.put('/upvote', (req, res) => {
   Post.upvote(req.body, { Vote })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
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