const webpack = require('webpack');

module.exports = {
  entry: 'src/index',
  plugins: [
    {
      resolve: '@poi/plugin-typescript',
      options: {}
    }
  ],
  output: {
    publicUrl: './',
    html: {
      title: 'FreeCell'
    }
  },
  constants: {
    description: 'トランプソリティア・フリーセルのプレイページ。'
  },
  configureWebpack: {
    plugins: [
      new webpack.BannerPlugin({
        banner: `
PixiJS
Copyright (c) 2013-2017 Mathew Groves, Chad Engler
MIT license
https://github.com/pixijs/pixi.js/blob/v4.8.8/LICENSE

tween.js
Copyright (c) 2010-2012 Tween.js authors.
Easing equations Copyright (c) 2001 Robert Penner http://robertpenner.com/easing/
MIT license
https://github.com/tweenjs/tween.js/blob/master/LICENSE
`,
        include: /.*chunk-vendors.*\.js$/
      })
    ]
  }
}