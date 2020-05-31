module.exports = function (poll) {
    console.log('starting ranked choice', poll);
    const votes = poll.votes;
    let allowedOptions = poll.options.slice(0);
    const maxRounds = allowedOptions.length;

    const resultsTable = [];
    let winner = '';

    for (let round = 0; round < maxRounds; round++) {
        let voteCounts = {};

        for (let i in votes) {
            // Find choices that are still allowed and sort them by rank
            let highestVote = votes[i].choices.filter(function (x) {
                return allowedOptions.indexOf(x.option) > -1;
            }).reduce(function(lowest, current) {
                // Find priority vote for person
                if (!lowest) {
                    return current;
                }
    
                if (lowest.rank < current.rank) {
                    return lowest;
                } else {
                    return current;
                }
            });

            if (highestVote) {
                // Count their vote if they voted for a remaining option
                if (voteCounts[highestVote.option]) {
                    voteCounts[highestVote.option] += 1;
                } else {
                    voteCounts[highestVote.option] = 1;
                }
            }
        }

        resultsTable.push(voteCounts);

        // Remove the options that got no votes this round first
        allowedOptions = allowedOptions.filter(function (o) {
            return voteCounts[o] > 0;
        });

        // Sort options by performance
        allowedOptions.sort(function (a, b) {
            return voteCounts[b] - voteCounts[a];
        });

        // Prevent removing option if it is tied with the leader
        const leader = allowedOptions[0];
        const loser = allowedOptions[allowedOptions.length - 1];

        if (voteCounts[leader] === voteCounts[loser]) {
            winner = '';
            break;
        }

        // Remove lowest performing options
        const lowestVoteCount = voteCounts[loser] || 1;
        allowedOptions = allowedOptions.filter(function (o) {
            return voteCounts[o] > lowestVoteCount;
        });

        // if winner exists, name winner, otherwise send to another round
        if (allowedOptions.length <= 1 || voteCounts[leader] / votes.length > .5) {
            winner = leader;
            break;
        }

        console.log('remaining options after round ' + (round + 1), allowedOptions);
    }

    console.log('finished', winner, allowedOptions, resultsTable);

    return {
        winner: winner || ('Tie between ' + allowedOptions.join(', ')),
        resultsTable: resultsTable
    };
}