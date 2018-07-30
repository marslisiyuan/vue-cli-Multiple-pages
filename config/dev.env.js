var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  LOGIC_SERVER_URL: '"http://dev.client.star.m1book.com/"',
  WX_APP_ID: '"wx1b3d5b642bbd7335"',
  LUCK_MONEY_PROJECT_ID: '"03929fe81d0211e88fc77cd30abeb941"',
  SWEET_HEART_PROJECT_ID: '"03929fe81d0211e88fc77cd30abeb943"',
  CNZZ_KEY: '""'
})
