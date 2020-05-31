let mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';
let MongoClient = require('mongodb').MongoClient;
let ObjectId = require('mongodb').ObjectId; 
let RankedChoice = MongoClient.connect(mongoUri, {
    useNewUrlParser: true
}, function(err, databaseConnection) {
    RankedChoice = databaseConnection.db('rankedChoice');
});

function getAllPolls() {
    return RankedChoice.collection('polls').find();
}

function getPoll(id) {
    return RankedChoice.collection('polls')
        .findOne({'_id': ObjectId(id)})
        .then(function (data) {
            return data;
        }).catch(function (err) {
            throw err;
        });
}

function deletePoll(id) {
    return RankedChoice.collection('polls')
        .deleteOne({'_id': ObjectId(id)})
        .then(function (data) {
            return true;
        }).catch(function (err) {
            throw err;
        });
}

function addPoll(pollData) {
    const poll = {
        name: pollData.name,
        description: pollData.description,
        options: pollData.options,
        votes: []
    };

    return RankedChoice.collection('polls')
        .insertOne(poll)
        .then(function (result) {
            return result.insertedId;
        }).catch(function (err) {
            throw err
        });
}

function updatePoll(id, pollData) {
    return getPoll(id)
        .then(function (poll) {
            poll.name = pollData.name;
            poll.description = pollData.description;
            poll.options = pollData.options;

            return RankedChoice.collection('polls')
                .updateOne({'_id': ObjectId(id)}, { $set: poll }, { upsert: true })
                .then(function (result) {
                    return id;
                }).catch(function (err) {
                    throw err
                });
        }).catch(function (err) {
            throw err;
        });
}

function addVote(id, voter, choices) {
    const vote = {
        'voter': voter,
        'choices': choices
    };

    return RankedChoice.collection('polls')
        .updateOne({'_id': ObjectId(id)}, { $push: { votes: vote } })
        .then(function () {
            return true;
        }).catch(function (err) {
            throw err;
        });
}

// Main function of this dto is to obscure the votes of the other voters from the client side
function pollToDto(poll) {
    return {
        id: poll._id,
        name: poll.name,
        description: poll.description,
        options: poll.options,
        voters: poll.votes && poll.votes.map(x => x.voter) || []
    };
}

module.exports = {
    getAll: getAllPolls,
    get: getPoll,
    delete: deletePoll,
    add: addPoll,
    update: updatePoll,
    vote: addVote,
    toDto: pollToDto
};