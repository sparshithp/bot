var tokens = {
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'A hard to guess string',
  //MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/food',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://spa:password@ds011775.mlab.com:11775/food',
  FACEBOOK_SECRET: process.env.FACEBOOK_SECRET || '97428b5bb4c6df6e935595b9e04e9a4c',
  GITHUB_SECRET: process.env.GITHUB_SECRET || 'a2df10d0cc1b4bb5e74e17a839464e7ac1fbd08b',
  LINKEDIN_SECRET: process.env.LINKEDIN_SECRET || '27fe7bd3-e9ce-4295-8c80-12208b332b83'
 
};

module.exports = tokens;