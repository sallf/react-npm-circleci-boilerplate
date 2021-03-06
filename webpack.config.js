// SETUP
const path = require('path');

// PLUGINS
const HtmlWebpackPlugin = require('html-webpack-plugin'); // simplifies HTML files for webpack (really connects to the index.ejs file)
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // remove/clean your build folder(s)

const resolveConfig = require('./webpack.config.resolve');

module.exports = (env, argv) => {
  const { mode } = argv;

  // MODE
  const isProd = mode === 'production';
  const isDev = mode === 'development';

  console.info(
    `Environment: ${env} | Mode: ${mode}`,
  );

  // RESOLVE
  const contextPath = path.resolve(__dirname, 'src');
  const outputPath = path.resolve(__dirname, 'public');

  // PLUGINS
  const htmlWebpackPlugin = new HtmlWebpackPlugin({
    title: `Your Site Title ${isDev ? '| DEVELOPMENT' : ''}`,
    template: './index.ejs',
    inject: true, // Inject all files that are generated by webpack
    minify: false,
  });

  const cleanWebpackPlugin = new CleanWebpackPlugin();

  const plugins = [
    htmlWebpackPlugin,
  ];

  if (isProd) {
    plugins.push(
      cleanWebpackPlugin,
    );
  }

  return ({
    context: contextPath,
    devtool: isDev ? 'inline-sourcemap' : false, // Easier debugging in dev
    entry: './index.jsx',
    resolve: {
      alias: {
        ...resolveConfig.resolve.alias,
        config: path.resolve(__dirname, 'config', env),
      },
      extensions: ['*', '.js', '.json', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            'style-loader', // Creates `style` nodes from JS strings
            'css-loader', // Translates CSS into CommonJS
            'sass-loader', // Compiles Sass to CSS
          ],
        },
        {
          test: /\.(png|jpg|gif)$/i,
          use: [
            {
              loader: 'url-loader', // transforms files into base64 URIs
              options: {
                limit: 10000,
              },
            },
          ],
        },
      ],
    },
    output: {
      path: outputPath,
      filename: '[name].js',
      publicPath: '/',
    },
    plugins,
    devServer: {
      historyApiFallback: true,
      contentBase: './src',
    },
  });
};
