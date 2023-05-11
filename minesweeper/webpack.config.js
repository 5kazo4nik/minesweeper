const webpack = require('webpack'); // не используется
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';
  const filename = (ext) => (isProduction ? `[name].[contenthash].${ext}` : `[name].${ext}`);
  const optimization = () => {
    const configObj = {
      splitChunks: {
        chunks: 'all',
      },
    };
    if (isProduction) {
      configObj.minimizer = [new CssMinimizerWebpackPlugin(), new TerserWebpackPlugin()];
    }
    return configObj;
  };

  const config = {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'source-map',
    // watch: !isProduction,
    watchOptions: {
      poll: true,
      ignored: /node_modules/,
    },
    optimization: optimization(),
    devServer: {
      historyApiFallback: true,
      static: {
        directory: path.resolve(__dirname, 'source'),
      },
      open: true,
      compress: true,
      hot: true,
      port: 3000,
    },
    entry: {
      main: './source/scripts/index.js',
    },
    output: {
      path: path.resolve(__dirname, 'app'),
      filename: `./scripts/${filename('js')}`,
      publicPath: '',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
        {
          test: /\.html$/i,
          loader: 'html-loader',
        },
        {
          test: /\.s[ac]ss$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
        {
          test: /\.svg$/i,
          type: 'asset/resource',
          generator: {
            filename: `./assets/svg/${filename('[ext]')}`,
          },
        },
        {
          test: /\.gif$/i,
          type: 'asset/resource',
          generator: {
            filename: `./assets/gif/${filename('[ext]')}`,
          },
        },
        {
          test: /\.mp3$/i,
          type: 'asset/resource',
          generator: {
            filename: `./assets/sound/${filename('[ext]')}`,
          },
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: `./styles/${filename('css')}`,
      }),
      new HtmlWebpackPlugin({
        template: './source/index.html',
        filename: 'index.html',
        minify: {
          collapseWhitespace: isProduction,
        },
      }),
    ],
  };
  return config;
};
