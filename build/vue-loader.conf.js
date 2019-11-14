'use strict'
const utils = require('./utils')
const config = require('../config')
const isProduction = process.env.NODE_ENV === 'production'

let buildConfig = config.build_prod;
if(process.env.NODE_ENV == 'staging') {
  buildConfig = config.build_staging;
}

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: isProduction
      ? buildConfig.productionSourceMap
      : config.dev.cssSourceMap,
    extract: isProduction
  }),
  transformToRequire: {
    video: 'src',
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
