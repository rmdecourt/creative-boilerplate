import ESLintPlugin from 'eslint-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { fileURLToPath } from 'url';
import { resolve, dirname, join } from 'path';
// import CopyWebpackPlugin from 'copy-webpack-plugin';

const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev';
const __dirname = dirname(fileURLToPath(import.meta.url));

const paths = {
  app: resolve(__dirname, 'app'),
  dist: resolve(__dirname, 'dist'),
  scripts: resolve(__dirname, 'app/scripts'),
  styles: resolve(__dirname, 'app/styles'),
  views: resolve(__dirname, 'app/views'),
  assets: resolve(__dirname, 'app/assets'),
  node: resolve(__dirname, 'node_modules'),
};

const page = (name, template, chunks) => {
  return new HtmlWebpackPlugin({
    filename: name + '.html',
    template: template,
    chunks: chunks,
  });
};

export default {
  entry: {
    main: [join(paths.scripts, 'main.ts'), join(paths.styles, 'main.scss')],
  },

  output: {
    path: paths.dist,
    filename: '[name].bundle.js',
    clean: true,
  },

  resolve: {
    modules: [paths.app, paths.scripts, paths.styles, paths.assets, paths.node],
    extensions: ['.js', '.ts', '.scss'],
  },

  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['html-loader'],
      },

      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
      },

      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
        },
      },

      {
        test: /\.scss$/,
        use: [
          // { loader: 'style-loader' },
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: paths.build,
            },
          },
          { loader: 'css-loader' },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader' },
        ],
      },

      {
        test: /\.(png|jpe?g|gif|svg|woff2?|fnt|webp)$/,
        type: 'asset/resource', // loads files into output directory
        // type: 'asset/inline', // inlines files as base64
        // type: 'source' // exports raw source code
      },
    ],
  },

  devServer: {
    host: 'localhost',
    port: 3000,
    hot: true,
    open: true,
  },

  plugins: [
    new webpack.DefinePlugin({
      IS_DEVELOPMENT,
    }),

    // new CopyWebpackPlugin({
    //   patterns: [{ from: './app/assets', to: '.' }],
    // }),

    new MiniCssExtractPlugin({
      filename: 'style.css',
      chunkFilename: '[id].css',
    }),

    new webpack.HotModuleReplacementPlugin(),

    new ESLintPlugin(),

    new webpack.ProvidePlugin({
      _: 'lodash',
    }),

    new CleanWebpackPlugin(),

    page('index', join(paths.views, 'index.html'), ['main']),
  ],
};
