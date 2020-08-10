const path = require('path');
module.exports = function (PATHS) {
    return {
        devServer: {
            // contentBase: path.join(PATHS.dist, '/assets'),
            compress: true,
            port: 8080,
            stats: 'errors-only',
            host: '0.0.0.0',
            // open: true
        }
    }
};