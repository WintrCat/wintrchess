const { Configuration } = require("webpack");
const { resolve } = require("path");
const DotenvPlugin = require("dotenv-webpack");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

require("dotenv").config({ path: "../.env" });

const nodeEnv = "development";

const entryPoints = {
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
  unfound: "./src/apps/unfound/index.tsx",
};

/**
 * @type {Configuration}
 */
module.exports = {
  entry: entryPoints,
  output: {
    filename: "[name].bundle.js",
    path: resolve("./dist"),
    publicPath: "/",
  },
  devtool: "eval-source-map",
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    alias: {
      "@": resolve("./src"),
      "@analysis": resolve("./src/apps/features/analysis"),
      "@assets": resolve("./public"),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: [require.resolve("react-refresh/babel")],
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.(png|svg|gif|ttf|mp3)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new DotenvPlugin({
      systemvars: true,
      path: "../.env",
      silent: true,
    }),
    new ReactRefreshWebpackPlugin(),
    ...Object.keys(entryPoints).map(
      (entryName) =>
        new HtmlWebpackPlugin({
          filename: `${entryName}.html`,
          template: `./public/apps/${entryName === "internal" || entryName === "settings" || entryName === "unfound"
            ? `${entryName}.html`
            : entryName === "signin" || entryName === "resetPassword" || entryName === "profile"
              ? `account/${entryName}.html`
              : entryName === "analysis" || entryName === "archive" || entryName === "news"
                ? `features/${entryName}.html`
                : `footer/${entryName}.html`
            }`,
          chunks: [entryName],
        })
    ),
  ],
  mode: nodeEnv,
  devServer: {
    port: 3000,
    hot: true,
    compress: true,
    static: {
      directory: resolve("./public"),
    },
    historyApiFallback: {
      rewrites: [
        ...Object.keys(entryPoints).map((entryName) => ({
          from: new RegExp(`^/${entryName}.*`),
          to: `/${entryName}.html`,
        })),
        { from: /.*/, to: "/unfound.html" },
      ],
    },
  },
};
