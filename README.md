# tweeter-deleter

This is a script I wrote to review and delete tweets sourced from my tweet archive one-by-one. Background is that I used https://github.com/koenrh/delete-tweets to bulk delete most of my (definitely filler, not killer) tweets but there is still a body of tweets remaining that I want to sift through manually cuz I'm really funny.

## Usage
### First time
1. Create a Twitter dev account, create an app with read/write permissions, and get credentials for your own account. Add the following env vars: `TWITTER_ACCESS_TOKEN`, `TWITTER_ACCESS_TOKEN_SECRET`, `TWITTER_CONSUMER_KEY`, `TWITTER_CONSUMER_SECRET` to your environment. If you can't be bothered to do this, that's fine. You can just open the link and delete manually.
2. Execute `npm run start ~/path/to/twitter-2022-blah/data/tweet.js`
3. A tweet and some details of it will be printed and the tool will prompt you to either: `o to open, d to delete, x to exit`.  
o = open link to tweet in browser  
d = delete it  
x = exit script
4. Upon exiting, a "pagination" token (it's the id of the tweet you left off on) will be printed. Copy this for next time.

### Next time
Execute `npm run start ~/path/to/twitter-2022-blah/data/tweet.js ["pagination" token]`

### Recommendation
Delete your rt's and bunk tweets using the aforementioned delete-tweets command line tool. Then, request your tweet archive again and use this script (if you so wish to).
