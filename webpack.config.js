// SETUP
const webpack = require('webpack');
const path = require('path');
const contextPath = path.join(__dirname, 'src');
const outputPath = path.join(__dirname, 'public');

const env = process.env.NODE_ENV;
const isDev = env === 'development';
const isProd = env === 'production';

// PLUGINS
const HtmlWebpackPlugin = require('html-webpack-plugin'); // simplifies HTML files for webpack (really connects to the index.ejs file)
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // remove/clean your build folder(s)

const htmlWebpackPlugin = new HtmlWebpackPlugin({
  title: 'Your Site Title' + (isDev ? ' | DEVELOPMENT' : ''),
  template: './index.ejs'
});

const cleanWebpackPlugin = new CleanWebpackPlugin();

const definePlugin = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify('production')
  }
});

let plugins = [];
if (isDev) {
  plugins = [
    htmlWebpackPlugin
  ];
} else if (isProd) {
  plugins = [
    htmlWebpackPlugin,
    cleanWebpackPlugin,
    definePlugin,
  ];
}

const config = {
  // Note mode is set through the package.json script
  context: contextPath,
  devtool: isDev ? 'inline-sourcemap' : false,
  entry: './index.jsx',
  mode: env,
  resolve: {
    alias: {
      config: path.join(__dirname, 'config', process.env.NODE_ENV),
    },
    extensions: ['.js', '.json', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [
            '@babel/preset-env',
            "@babel/preset-react",
          ],
          plugins: [
            '@babel/plugin-proposal-class-properties',
          ],
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      }
    ]
  },
  output: {
    path: outputPath,
    filename: isDev ? '[name].js' : '[name].js',
    publicPath: '/'
  },
  plugins,
}

module.exports = config;
