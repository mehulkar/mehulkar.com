import { Client } from "twitter-api-sdk";
import TwitterText from "twitter-text";
import { shuffle } from "./_utils.mjs";

const client = new Client(process.env.TWITTER_BEARER_TOKEN);

async function getRandomLikedTweet(username) {
  const user = await client.users.findUserByUsername(username);
  console.log(`Retreived user id for mehulkar`, user.data.id);
  const likes = await client.tweets.usersIdLikedTweets(user.data.id);
  console.log(`Fetched ${likes.data.length} liked tweets`);
  const shuffled = shuffle(likes.data);
  const tweet = shuffled[0];
  return tweet.id;
}

async function getRandomTweet() {
  const tweetId = await getRandomLikedTweet("mehulkar");
  console.log(`Fetching data for tweet id`, tweetId);

  const tweetData = await client.tweets.findTweetById(tweetId, {
    "tweet.fields": "author_id,source,entities,created_at,referenced_tweets",
    expansions: "referenced_tweets.id",
  });

  console.log("[debug] tweet data", tweetData);

  const author = await client.users.findUserById(tweetData.data.author_id);

  const options = {};
  if (tweetData.data.entities && tweetData.data.entities.urls) {
    options.urlEntities = tweetData.data.entities.urls;
  }

  // https://github.com/twitter/twitter-text/blob/30e2430d90cff3b46393ea54caf511441983c260/js/pkg/twitter-text-3.1.0.js#L2897-L2906
  tweetData.data.html = TwitterText.autoLink(
    TwitterText.htmlEscape(tweetData.data.text),

    options
  );

  tweetData.data.html = tweetData.data.html.replaceAll("\n", "<br />");

  return {
    author: author.data,
    tweet: tweetData.data,
  };
}

export default async function handler(req, res) {
  try {
    const randomTweet = await getRandomTweet();
    return res.status(200).json(randomTweet);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      error: e,
    });
  }
}