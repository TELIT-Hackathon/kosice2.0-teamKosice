const path = require('path');

module.exports = {
    mode: "development",
    entry: {
        index:'./assets/jsx/index.jsx'
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/assets/js',
    },
    module:{
        rules:[
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loader: "babel-loader",
                options:{
                    presets:[ "@babel/preset-react"]
                }
            }
        ]
    }
  };