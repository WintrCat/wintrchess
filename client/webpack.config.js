const { Configuration } = require("webpack");
const { resolve } = require("path");
const DotenvPlugin = require("dotenv-webpack");

require("dotenv").config({ path: "../.env" });

const nodeEnv = process.env.NODE_ENV || "production";

/**
 * @type {Configuration}
 */
module.exports = {
    entry: {
        analysis: "./src/apps/features/analysis/index.tsx",
        archive: "./src/apps/features/archive/index.tsx",
        news: "./src/apps/features/news/index.tsx",

        signin: "./src/apps/account/signin/index.tsx",
        resetPassword: "./src/apps/account/resetPassword/index.tsx",
        profile: "./src/apps/account/profile/index.tsx",

        helpCenter: "./src/apps/footer/helpCenter/index.tsx",
        legal: "./src/apps/footer/legal/index.tsx",

        settings: "./src/apps/settings/index.tsx",
        internal: "./src/apps/internal/index.tsx",
        unfound: "./src/apps/unfound/index.tsx"
    },
    output: {
        filename: "[name].bundle.js",
        path: resolve("./dist")
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        alias: {
            "@": resolve("./src"),
            "@analysis": resolve("./src/apps/features/analysis"),
            "@assets": resolve("./public")
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/i,
                use: "babel-loader"
            },
            {
                test: /\.css$/i,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|svg|gif|ttf|mp3)$/i,
                type: "asset"
            }
        ]
    },
    plugins: [
        new DotenvPlugin({
            systemvars: true,
            path: "../.env",
            silent: true
        })
    ],
    mode: nodeEnv
};