var path = require('path');

module.exports = {
    entry: './assets/js/chat.js',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, './public/js')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    },
    watch: true
};