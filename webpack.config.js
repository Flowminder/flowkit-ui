// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

const path = require("path")
const webpack = require("webpack")
const { resolve } = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const CONFIG = {
    // contains "development" || "production"
    mode: process.env.NODE_ENV,
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
        hashFunction: "xxhash64"
    },
    devtool:
        process.env.NODE_ENV === "development" || process.env.REACT_APP_GIT_BRANCH === "dev"
            ? "eval-source-map"
            : false,
    plugins: [
        new webpack.ProvidePlugin({ process: "process/browser" }),
        new webpack.EnvironmentPlugin([
            "REACT_APP_NAME",
            "REACT_APP_AUTH0_DOMAIN",
            "REACT_APP_AUTH0_CLIENT_ID_UI",
            "REACT_APP_MAPBOX_STYLE",
            "REACT_APP_MAPBOX_ACCESS_TOKEN",
            "REACT_APP_MAP_SEQUENTIAL_SCALE",
            "REACT_APP_MAP_DIVERGING_SCALE",
            "REACT_APP_MAP_QUALITATIVE_SCALE"
        ]),
        new HtmlWebpackPlugin({ title: process.env.REACT_APP_NAME })
    ],
    module: {
        rules: [
            {
                // Transpile ES6 to ES5 with babel
                // Remove if your app does not use JSX or you don't need to support old browsers
                test: /\.js$/,
                loader: "babel-loader",
                exclude: [/node_modules/],
                options: {
                    presets: ["@babel/preset-react"]
                }
            }
        ]
    },
    resolve: {
        alias: {
            // From mapbox-gl-js README. Required for non-browserify bundlers (e.g. webpack):
            "mapbox-gl$": resolve("./node_modules/mapbox-gl/dist/mapbox-gl.js")
        }
    },
    use: {
        loader: "babel-loader",
        options: {
            ignore: ["./node_modules/mapbox-gl/dist/mapbox-gl.js"]
        }
    }
}

// This line enables bundling against src in this repo rather than installed deck.gl module
module.exports = env => (env ? require("../../../webpack.config.local")(CONFIG)(env) : CONFIG)
