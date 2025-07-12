// Webpack configuration for static site build, SCSS, image optimization, and asset copying
const path = require('node:path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ProvidePlugin = require('webpack').ProvidePlugin;

module.exports = {
  entry: {
    main: './app/scripts/main.js',
    vendor: [
      'howler',
      'jquery',
      'jquery-ui',
      'jquery-ui-touch-punch',
      'file-saver',
    ],
  },
  output: {
    filename: "scripts/[name].bundle-[contenthash].js",
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
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
        test: /\.scss$/,
        use: [
          // In development, 'style-loader' can be used for HMR
          // In production, 'MiniCssExtractPlugin.loader' is used to extract CSS into separate files
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true, // Equivalent to $.sourcemaps.init()
              url: false,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true, // Equivalent to $.sourcemaps.init() and $.sourcemaps.write()
              sassOptions: {
                outputStyle: 'expanded', // Equivalent to outputStyle: 'expanded'
                precision: 10, // Equivalent to precision: 10
                includePaths: ['./'], // Equivalent to includePaths: ['.']
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico|bmp)$/i,
        type: 'asset',
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: 'styles/[name].css' }),
    new HtmlWebpackPlugin({
      template: 'app/index.html',
      minify: { collapseWhitespace: true, removeComments: true },
      inject: 'body',
      chunks: ['vendor', 'main'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'app/images', to: 'images' },
        { from: 'app/images/win98_icons', to: 'images/win98_icons' }, // Explicitly copy all win98_icons including .ico
        { from: 'app/installed-programs', to: 'installed-programs' },
        { from: 'app/sounds', to: 'sounds' },
        { from: 'app/styles/jquery-ui.css', to: 'styles/jquery-ui.css' },
        { from: 'app/favicon.ico', to: 'favicon.ico' },
        { from: 'app/robots.txt', to: 'robots.txt' }
      ],
    }),
    new ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false, // Do not extract comments to a separate file
      }),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
              ['svgo', { plugins: [{ removeViewBox: false }] }],
            ],
          },
        },
      }),
    ],
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  devServer: {
    static: [{
      directory: path.join(__dirname, "app/installed-programs"),
      publicPath: '/installed-programs',
    }, {
      directory: path.join(__dirname, "app/images"),
      publicPath: '/images',
    }, {
      directory: path.join(__dirname, "app/sounds"),
      publicPath: "/sounds",
    }],
    compress: true,
    port: 9000,
    open: true,
    hot: true,
    watchFiles: ['app/**/*'],
  },
  resolve: {
    extensions: ['.js', '.scss', '.css', '.ts'],
  },
  mode: 'development',
};
