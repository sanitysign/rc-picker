const path = require("path")
require("dotenv").config()
const webpack = require("webpack")
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const CircularDependencyPlugin = require("circular-dependency-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = (env, argv) => {
  console.log("WEBPACK_MODE:", argv.mode, "NODE_ENV:", process.env.NODE_ENV)
  const isDev = argv.mode === "development"
  const isServed = !!process.env.WEBPACK_SERVE
  process.env.BROWSERSLIST_ENV = argv.mode

  return {
    entry: "./index.tsx",
    output: {
      filename: "[name].[contenthash].js",
      chunkFilename: isDev ? "[name].js" : "[name].[chunkhash].js",
      clean: !isServed,
    },
    devServer: {
      // open: true,
      historyApiFallback: true,
      client: {
        logging: "warn",
      },
      allowedHosts: [".test.site"],
    },
    stats: "errors-warnings",
    devtool: 'eval-cheap-module-source-map',
    module: {
      rules: [
        {
          test: /\.(jsx?|tsx?)$/i,
          exclude: isDev ? [/node_modules/] : [],
          loader: "babel-loader",
        },
        {
          test: /\.s?css$/i,
          use: [
            isDev ? "style-loader" : MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                url: {
                  filter: url => !new URLSearchParams(url.split("?")[1]).has("static"),
                },
                modules: {
                  auto: true,
                },
                importLoaders: 1,
              },
            },
            "sass-loader",
          ],
        },
        {
          test: /\.svg$/i,
          exclude: /node_modules/,
          type: "asset",
          resourceQuery: { not: [/svgr/] },
        },
        {
          test: /\.svg$/i,
          issuer: /\.jsx?$/i,
          use: {
            loader: "@svgr/webpack",
            options: {
              svgoConfig: {
                plugins: [
                  {
                    name: "prefixIds",
                    params: {
                      prefixClassNames: false,
                    },
                  },
                ],
              },
            },
          },
          resourceQuery: /svgr/,
        },
        {
          test: /\.html$/i,
          exclude: /node_modules/,
          type: "asset/source",
          resourceQuery: /source/,
        },
        {
          test: /\.(png|jpe?g|gif|ico)$/i,
          exclude: /node_modules/,
          type: "asset",
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf|mp3)$/i,
          exclude: /node_modules/,
          type: "asset/resource",
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    },
    plugins: [
      isServed && new ReactRefreshWebpackPlugin({ overlay: false }),
      new CircularDependencyPlugin(),
      new HtmlWebpackPlugin({
        template: "./index.html",
      }),
      !isDev &&
        new MiniCssExtractPlugin({
          filename: "[name].[contenthash].css",
          chunkFilename: "[id].[contenthash].css",
        }),
      new webpack.ProvidePlugin({
        React: "react",
      }),
    ].filter(Boolean),
    optimization: {
      minimizer: [`...`, new CssMinimizerPlugin()],
      runtimeChunk: "single",
      splitChunks: {
        chunks: "all",
      },
    },
  }
}
