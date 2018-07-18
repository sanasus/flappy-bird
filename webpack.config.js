const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
// const javascript = require('./webpack/javascript');
const ts = require('./webpack/ts');
const scss = require('./webpack/scss');
const pug = require('./webpack/pug');
const file = require('./webpack/file');
const devserver = require('./webpack/devserver');
const uglifyjs = require('./webpack/uglifyjs');
const minImg = require('./webpack/imgmin');
const HappyPack = require('happypack');
var ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const PATHS = {
    src: path.join(__dirname, 'src'),
    dist: path.join(__dirname, 'dist')
};
const common = merge([
    {
        entry: {
            app: './app.ts'
        },
        context: PATHS.src,
        output: {
            path: PATHS.dist,
            filename: './assets/js/[name].bundle.js'
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js", ".png"],
            alias: {
                '@img': './assets/img',
                '@images': '../img'
            }
        },
        devtool: 'inline-source-map',
        plugins: [
            new CleanWebpackPlugin(['dist/*']),
            new HtmlWebpackPlugin({
                title: 'index.html',
                template: path.join(PATHS.src, 'index.pug'),
            }),
        new HappyPack({
                id: 'ts',
                threads: 2,
                loaders: [
                    {
                        path: 'ts-loader',
                        query: { happyPackMode: true }
                    }
                ]
            }),
            new ForkTsCheckerWebpackPlugin({ 
                checkSyntacticErrors: true,
                tsconfig: path.resolve(__dirname, './tsconfig.json'),
                tslint: path.resolve(__dirname, './tslint.json'),
            })
        ]
    },
    // javascript(),
    ts(),
    scss(),
    pug(),
    file()
]);

module.exports = function (env) {
    if (env === 'production') {
        return merge([
            common,
            uglifyjs(),
            minImg()
        ]);
    }
    if (env === 'development') {
        return merge([
            common,
            devserver(PATHS),
        ])
    }
};