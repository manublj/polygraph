const webpack = require('webpack');

module.exports = {
    webpack: {
        configure: {
            resolve: {
                fallback: {
                    "crypto": false,
                    "stream": require.resolve("stream-browserify"),
                    "util": require.resolve("util/"),
                    "path": require.resolve("path-browserify"),
                    "process": require.resolve("process/browser"),
                    "buffer": require.resolve("buffer/"),
                    "events": require.resolve("events/"),
                }
            },
            plugins: [
                new webpack.ProvidePlugin({
                    process: 'process/browser',
                    Buffer: ['buffer', 'Buffer'],
                }),
            ],
        }
    }
};