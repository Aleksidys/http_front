/* eslint-disable */
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');
const path = require('path');

const options = {
  extensions: ['js', 'jsx'],
  /* другие настройки */
};

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'My App',
      template: 'src/index.html',
      filename: 'main.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.css'
    }),
    new ESLintPlugin(options)
  ],
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    open: {
      target: 'main.html', // Открывать main.html при старте сервера
    },
  },
};









