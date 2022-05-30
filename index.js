const fs = require('fs');
const prompt = require('prompt-sync')();
const tw = require('twitter-api-v2');
const open = require('open');

const client = new tw.TwitterApi({
    appKey: process.env.TWITTER_CONSUMER_KEY,
    appSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

let tweets = null;
let i = 0;

const readArchive = (path) => {
    const data = fs.readFileSync(path, 'utf8');
    const jsonString = data.replace(/window.YTD.tweet.part0 = /g, '');
    tweets = JSON.parse(jsonString);

    console.log(`Total in tweet.js: ${tweets.length} tweets!`);

    // second arg: pagination token / last id looked at
    const pageToken = process.argv[3];

    if (pageToken != null && pageToken !== "") {
        let target = tweets[i];
        while (target.tweet.id_str !== pageToken) {
            i++;
            target = tweets[i];
            console.log(target);
        }
    }
}

const processTweet = async (id, link) => {    
    const answer = prompt("What'll it be? (o to open, k to keep, x to exit, enter to delete) ");
    if (answer === "k" || answer === ".") {
        console.log("OK keeping.");
    } else if (answer === "o") {
        console.log("OK opening.");
        open(link);
    } else if (answer === "x") {
        console.log(`OK. Pagination token for next time in case you need it: ${id}`);
        process.exit();
    } else {
        console.log("OK deleting.");
        const deletedTweet = await client.v1.deleteTweet(id);
        console.log("Deleted tweet", deletedTweet.id_str, ":", deletedTweet.full_text);
    }
}

const processTweetsFromArchive = async (username) => {    
    while (i < tweets.length) {
        const target = tweets[i];
        const relevant = {
            retweet_count: target.tweet.retweet_count,
            favorite_count: target.tweet.favorite_count,
            created_at: target.tweet.created_at,
            full_text: target.tweet.full_text,
            link: `https://twitter.com/${username}/status/${target.tweet.id_str}`
        };
        console.log(relevant);
        await processTweet(target.tweet.id_str, relevant.link);
    
        i++;
    }
}

const processTweetsFromApi = async (username) => {    
    const userTimeline = await client.v1.userTimelineByUsername(username);
    for await (const tweet of userTimeline) {
        const relevant = {
            retweet_count: tweet.retweet_count,
            favorite_count: tweet.favorite_count,
            created_at: tweet.created_at,
            full_text: tweet.full_text,
            link: `https://twitter.com/${username}/status/${tweet.id_str}`
        };
        console.log(relevant);
        await processTweet(tweet.id_str, relevant.link);
    }
}

const main = async () => {
    const resp = await client.v1.verifyCredentials();
    const username = resp.screen_name;
    console.log(`Just gonna assume this is u: @${username}`);
    console.log(`Actual # tweets: ${resp.statuses_count}\n`);

    // first arg: file path to tweet.js. if null, pull tweets from api.
    const firstArg = process.argv[2];

    if (firstArg && firstArg !== "") {
        readArchive(firstArg);
        await processTweetsFromArchive(username);
    } else {
        await processTweetsFromApi(username);
    }
}

main();
