const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const dotenv = require('dotenv');

process.env.NODE_ENV = "development";
const env = dotenv.config().parsed;
const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
}, {});

module.exports = {
    mode: "development",
    target: "web",
    devtool: "cheap-module-source-map",
    entry: "./src/index",
    output: {
        path: path.resolve(__dirname, "build"),
        publicPath: "/",
        filename: "bundle.js"
    },
    devServer: {
        stats: "minimal",
        overlay: true,
        historyApiFallback: true,
        disableHostCheck: true,
        headers: { "Access-Control-Allow-Origin": "*" },
        https: false,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/index.html"
        }),
        new webpack.DefinePlugin(envKeys)
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader", "eslint-loader"]
            },
            {
                test: /(\.css)$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    }
};
