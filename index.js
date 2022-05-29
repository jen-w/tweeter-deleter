const fs = require('fs');
const prompt = require('prompt-sync')();
const tw = require('twitter-api-v2');
const open = require('open');

// first arg: file path to tweet.js
const data = fs.readFileSync(process.argv[2], 'utf8');
const jsonString = data.replace(/window.YTD.tweet.part0 = /g, '');
const tweets = JSON.parse(jsonString);

console.log(`Total: ${tweets.length} tweets!`);

// second arg: pagination token / last id looked at
const pageToken = process.argv[3];
let i = 0;

if (pageToken != null && pageToken !== "") {
    let target = tweets[i];
    while (target.tweet.id_str !== pageToken) {
        i++;
        target = tweets[i];
    }

}

const main = async () => {
    const client = new tw.TwitterApi({
        appKey: process.env.TWITTER_CONSUMER_KEY,
        appSecret: process.env.TWITTER_CONSUMER_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });
    
    while (i < tweets.length) {
        const target = tweets[i];
        const relevant = {
            retweet_count: target.tweet.retweet_count,
            favorite_count: target.tweet.favorite_count,
            created_at: target.tweet.created_at,
            full_text: target.tweet.full_text,
            link: "https://twitter.com/jenparmesan/status/" + target.tweet.id_str
        };
        console.log(relevant);
    
        const answer = prompt("What'll it be? (o to open, d to delete, x to exit) ");
        if (answer === "d") {
            console.log("OK deleting.");
            const deletedTweet = await client.v1.deleteTweet(target.tweet.id_str);
            console.log('Deleted tweet', deletedTweet.id_str, ':', deletedTweet.full_text);
        } else if (answer === "o") {
            console.log("OK opening.");
            open(relevant.link);
        } else if (answer === "^C" || answer === "x") {
            console.log(`OK. Pagination token for next time: ${target.tweet.id_str}`);
            return;
        } else {
            console.log("OK.");
        }
    
        i++;
    }
}

main();