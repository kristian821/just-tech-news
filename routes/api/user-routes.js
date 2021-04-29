const router = require('express').Router();
const { User, Post, Vote } = require('../../models');

// GET /api/users
router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['password'] }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch (err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET /api/users/1
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'post_url', 'created_at']
            },
            {
                model: Post,
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts'
            }
        ]
    }).then(dbUserData => {
        if (!UserData) {
            res.status(404).json({ message: "No user found with this id"});
            return;
        }
        res.json(dbUserData);
    }).catch(e => {
        console.log(e);
        res.status(500).json(e);
    });
});

// POST /api/users
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }).then(dbUserData => {
        res.json(dbUserData);
    }).catch(e => {
        console.log(e);
        res.status(500).json(e);
    });
});

router.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that email address!' });
            return;
        }
        const validPassword = dbUserData.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(400).json({ message: 'Your password was entered incorrectly.' });
            return;
        }

        res.json({ user: dbUserData, message: 'You are now logged in!' });
    }).catch(e => {
        console.log(e);
        res.status(500).json(e);
    })
});

// PUT /api/users/1
router.put('/:id', (req, res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    }).then(dbUserData => {
        if (!dbUserData[0]) {
            res.status(404).json({ message: "No user found with this id"});
            return;
        }
        res.json(dbUserData);
    }).catch(e => {
        console.log(e);
        res.status(500).json(e);
    })
});

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.body.id
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: "No user found with this id"});
            return;
        }
        res.json(dbUserData);
    }).catch(e => {
        console.log(e);
        res.status(500).json(e);
    });
});

module.exports = router;