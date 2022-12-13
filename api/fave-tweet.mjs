import { Client } from "twitter-api-sdk";
import TwitterText from "twitter-text";
import { shuffle } from "./_utils.mjs";

const client = new Client(process.env.TWITTER_BEARER_TOKEN);

const MY_TWITTER_HANDLE = "mehulkar";

async function getRandomLikedTweet(username) {
  const user = await client.users.findUserByUsername(username);
  const likes = await client.tweets.usersIdLikedTweets(user.data.id);

  const shuffled = shuffle(likes.data);
  const tweet = shuffled[0];
  return {
    id: tweet.id,
    meta: {
      user,
      totalLikes: likes.data.length,
    },
  };
}

async function getRandomTweet() {
  const { id: tweetId, meta } = await getRandomLikedTweet(MY_TWITTER_HANDLE);

  const tweetData = await client.tweets.findTweetById(tweetId, {
    "tweet.fields": "author_id,source,entities,created_at,referenced_tweets",
    expansions: "referenced_tweets.id",
  });

  const author = await client.users.findUserById(tweetData.data.author_id, {
    "user.fields": "profile_image_url",
  });

  const options = {};
  if (tweetData.data.entities && tweetData.data.entities.urls) {
    options.urlEntities = tweetData.data.entities.urls;
  }

  // https://github.com/twitter/twitter-text/blob/30e2430d90cff3b46393ea54caf511441983c260/js/pkg/twitter-text-3.1.0.js#L2897-L2906
  tweetData.data.html = TwitterText.autoLink(
    TwitterText.htmlEscape(tweetData.data.text),

    options
  );

  tweetData.data._originalHTML = tweetData.data.html;
  tweetData.data._htmlPrev = tweetData.data.html.replaceAll("\n", "<br>");

  // modifications
  // 1. replace \n with <br> (TODO: why doesn't library do this?)
  tweetData.data.html = tweetData.data.html.replaceAll(/\n+/g, "<br>");

  // 2. Move all "@"" from @username mentions inside the anchor tag.
  // tweetData.data.html = tweetData.data.html.replaceAll(
  //   /@\<a([^\>+])\>/g,
  //   "<a $1>@"
  // );

  tweetData.data.html = tweetData.data.html.replaceAll(
    /@<a([^>]*)>(.*)/g,
    "<a$1>@$2"
  );

  console.log(
    `Fetched ${tweetId} out of ${meta.totalLikes} likes for user: ${MY_TWITTER_HANDLE} with user ID ${meta.user.data.id}`
  );

  console.debug("tweet data", tweetData);
  console.debug("tweet author", author);

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
