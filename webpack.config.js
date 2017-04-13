var path = require('path');

module.exports = {
    entry: {
        chat: './assets/js/chat.js',
        lobby: './assets/js/lobby.js'
    },
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