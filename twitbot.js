
const _ = require('underscore');
const Twit = require('twit');
const twitterCreds = require('../config/credentials').TWITTER_CREDENTIALS_WAFFLE;
const waffleQuotes = require('./trump-waffle/config.js').WAFFLE_PHRASES;
const waffleURLS = require('./trump-waffle/config.js').WAFFLE_URLS;
const twit = new Twit(twitterCreds);
const TRUMP_ID = 25073877;

const getRandomWaffleQuote = (username) => {
  let randomQuote = waffleQuotes[Math.floor(Math.random()*waffleQuotes.length)];
  const randomURL = waffleURLS[Math.floor(Math.random()*waffleURLS.length)];
  randomQuote = randomQuote.replace('${NAME}', username).replace('${URL}', randomURL);
  return randomQuote;
}

const tweetWaffleStatus = (status) => {
  twit.post('statuses/update', { status }, function(err, data, response) {
    if (err) {
      console.log(err)
    }
    else {
      console.log(data.entities.user_mentions[0].screen_name)
    }
  });
}

const getRetweetsOfStatus = (id) => {
  twit.get('statuses/retweets/:id', { id, count: 10 })
    .then((results) => {
      const users = _.map(results.data, (status) => {
        return status.user.screen_name;
      });

      _.each(users, (user) => {
        const status = getRandomWaffleQuote(user);
        tweetWaffleStatus(status);
      })
    })
}

const getMostRecentTweet = () => {
  twit.get('statuses/user_timeline', { user_id: TRUMP_ID })
    .then((results) => {
      const mostRecentTweet = results.data[0].id_str;
      console.log(`Most recent tweet id: ${mostRecentTweet}`)
      getRetweetsOfStatus(mostRecentTweet);
    })
}

setInterval(getMostRecentTweet, 5 * 60 * 1000);
