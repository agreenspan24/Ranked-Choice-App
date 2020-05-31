## Ranked Choice App

Ranked Choice, or Instant Runoff, voting is a fairer way of gathering voter opinions and electing officials. This web application allows you to set up a Ranked Choice poll, allows others to vote in the poll, and calculates the result instantly.

#### How it works

With ranked choice voting, voters mark their ballots in order of preference – 1st choice, 2nd choice, 3rd choice, and so on. Then, choices are counted to determine which candidate has more than 50% of the votes after the first round of counting or if additional rounds of counting are needed to reach a majority. If no candidate has reached a majority (50% + 1), the candidate with the lowest number of votes is eliminated from the contest. Even though the candidate has been eliminated, the voters who had that candidate as their first choice will then have their vote count for the candidate they marked as their next choice. This process of eliminating the lowest candidates and adding the votes to remaining candidates continues until a candidate receives more than a majority of the remaining votes cast.

*Source: Ranked Choice Voting Center*

#### Why Ranked Choice Voting?

According to the Ranked Choice Voting Resource Center, potential benefits of Ranked Choice voting, are that it may

- Eliminate unnecessary primary and runoff elections
- Increase civility in campaigns
- Promote fair representation
- Avoid vote-splitting and weak plurality results
- Provide more choice for voters
- Minimize strategic voting
- Increase participation of military and overseas voters

*Source: Ranked Choice Voting Center and FairVote*
  
## Setup

If you have not already, install:
 - [Node.js.](https://nodejs.org/en/)
 - [Yarn](https://classic.yarnpkg.com/en/docs/install/) (not necessary but I prefer it)
 - [Mongo](https://www.mongodb.com/download-center/community)

Run `npm install` in the root directory and the `client` directory.

By default, MongoDB will point to localhost:27017 and the server will run at Port 3001. Please create a .env file and override those values. By default, the .env should look like this:

```
MONGO_URI=mongodb://localhost:27017
PORT=3001
```

To run your local MongoDB database, in your terminal, navigate to the root directory, and run the command `mongod`.

Then, in a separate terminal instance, run `yarn start` in the root directory. This will create a server instance and run at the port specified in the terminal. You can then open the app in your local.

In order to do client-side work, you will need to edit the react app. If you are editing a lot, and want continuous refreshes when you save new React code, first run `yarn start:dev` in the root directory. Then, go to the `client` directory and run `yarn start`. 

If you would like to build the React app, just run `yarn start` in the `client` directory, then load and run the app normally.

## Stack

This Ranked Choice voting app is a MERN stack app.

- MongoDB database
- Express.js web framework
- React.js client-side library
- Node.js JavaScript runtime

In addition, some of the tools it takes advantage of are:
- EJS templating
- Webpack
- Typescript
- Babel
- Material UI

## Sources on Ranked Choice Voting
- https://www.rankedchoicevoting.org/
- https://www.fairvote.org/
