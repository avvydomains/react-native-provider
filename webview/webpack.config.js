// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');

const isProduction = true;

const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const webpack = require('webpack')


const config = {
    entry: './src/index.js',
    mode: isProduction ? 'production' : 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '',
        filename: 'webview.js',
    },
    plugins: [
        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
        new webpack.DefinePlugin({
          process: {
            browser: true,
            env: {}
          }
        }),
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer']
        }),
        new HtmlWebpackPlugin({
          template: 'template.html',
          inject: false
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    resolve: {
      fallback: {
        os: false,
        crypto: false,
        util: false,
        buffer: require.resolve('buffer/'),
        assert: require.resolve('assert/'),
        events: require.resolve('events/'),
      }
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            output: {
              comments: false
            }
          }
        })
      ]
    }
};

module.exports = () => {
    return config;
};
