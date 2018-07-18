const tsconf = require('../tslint.json');
module.exports = function() {
    return {
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'happypack/loader?id=ts',
                    exclude: /node_modules/,
                }
            ],
        },
    };
};