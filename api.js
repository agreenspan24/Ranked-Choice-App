var express = require('express');
var router = express.Router();
var db = require('./db/poll');
var rankedChoice = require('./services/rankedChoice');

// Get All Polls in Dto form
router.get('/polls', function (req, res) {
    db.getAll().toArray(function (err, polls) {
        if (err) {
            res.status(400, err);
            return;
        }

        res.set('Content-Type', 'application/json');
        res.send(polls.map(db.toDto));
    });
});

// Get single poll from query string
router.get('/poll', function (req, res) {
    db.get(req.query.id)
        .then(function (data) {
            res.set('Content-Type', 'application/json');
            res.send(db.toDto(data));
        }).catch(function (err) {
            res.status(404, err);
        });
});

// Delete single poll
router.delete('/poll', function (req, res) {
    db.delete(req.query.id)
        .then(function (data) {
            res.send('success');
        }).catch(function (err) {
            res.status(400, err);
        });
});

// Create or Update Poll details
router.post('/poll', function (req, res) {
    const poll = {
        'name': req.body.name,
        'description': req.body.description,
        'options': req.body.options
    };

    if (req.body.id) {
        db.update(req.body.id, poll)
            .then(function (id) {
                res.send(id);
            }).catch(function (error) {
                res.status(400, error)
            });
    } else { 
        db.add(poll)
            .then(function (insertedId) {
                res.send(insertedId);
            }).catch(function (error) {
                res.status(400, error);
            });
    }
});

// Add a vote to the poll
// Note: Choices must be an array of option/rank pair objects
router.put('/vote', function (req, res) {
    db.vote(req.body.id, req.body.voter, req.body.choices)
        .then(function () {
            res.status(200);
        }).catch(function (err) {
            res.status(400, err);
        })

    res.send();
});

// Get the winner of the poll using the ranked choice algorithm
router.get('/poll/getWinner', function (req, res) {
    db.get(req.query.id).then(function (poll) {
        const results = rankedChoice(poll);

        res.set('Content-Type', 'application/json');
        res.send(results);
    }).catch(function (err) {
        res.status(400, err);
    });
});

module.exports = router;