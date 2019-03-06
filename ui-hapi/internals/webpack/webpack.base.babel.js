/**
 * COMMON WEBPACK CONFIGURATION
 */

const material = require('material-colors');
const path = require('path');
const webpack = require('webpack');

// Remove this line once the following warning goes away (it was meant for webpack loader authors not users):
// 'DeprecationWarning: loaderUtils.parseQuery() received a non-string value which can be problematic,
// see https://github.com/webpack/loader-utils/issues/56 parseQuery() will be replaced with getOptions()
// in the next major version of loader-utils.'
process.noDeprecation = true;

const processEnv = {
  NODE_ENV: JSON.stringify(process.env.NODE_ENV),
  API_HOST: JSON.stringify(process.env.API_HOST),
};

module.exports = options => ({
  mode: options.mode,
  entry: options.entry,
  output: Object.assign(
    {
      // Compile into js/build.js
      path: path.resolve(process.cwd(), 'build'),
      publicPath: '/',
    },
    options.output,
  ), // Merge with env dependent settings
  optimization: options.optimization,
  module: {
    rules: [
      {
        test: /\.js$/, // Transform all .js files required somewhere with Babel
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: options.babelQuery,
        },
      },
      {
        // Preprocess our own .css files
        // This is the place to add your own loaders (e.g. sass/less etc.)
        // for a list of loaders, see https://webpack.js.org/loaders/#styling
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        // Preprocess 3rd party .css files located in node_modules
        test: /\.css$/,
        include: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        use: 'file-loader',
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              // Inline files smaller than 10 kB
              limit: 10 * 1024,
              noquotes: true,
            },
          },
        ],
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // Inline files smaller than 10 kB
              limit: 10 * 1024,
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                enabled: false,
                // NOTE: mozjpeg is disabled as it causes errors in some Linux environments
                // Try enabling it in your environment by switching the config to:
                // enabled: true,
                // progressive: true,
              },
              gifsicle: {
                interlaced: false,
              },
              optipng: {
                optimizationLevel: 7,
              },
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.(mp4|webm)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        },
      },
    ],
  },
  plugins: options.plugins.concat([
    new webpack.ProvidePlugin({
      // make fetch available
      fetch: 'exports-loader?self.fetch!whatwg-fetch',
    }),

    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
    new webpack.DefinePlugin({
      'process.env': processEnv,
    }),
  ]),
  resolve: {
    modules: ['node_modules', 'app'],
    extensions: ['.js', '.jsx', '.react.js'],
    mainFields: ['browser', 'jsnext:main', 'main'],
  },
  devtool: options.devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window
  performance: options.performance || {},
  externals: {
    systemKeywords: JSON.stringify([
      {
        'keywordName': 'sys.spacy_person',
        'uiColor': material.red['500'],
      },
      {
        'keywordName': 'sys.spacy_norp',
        'uiColor': material.pink['500'],
      },
      {
        'keywordName': 'sys.spacy_org',
        'uiColor': material.purple['500'],
      },
      {
        'keywordName': 'sys.spacy_gpe',
        'uiColor': material.deepPurple['500'],
      },
      {
        'keywordName': 'sys.spacy_loc',
        'uiColor': material.indigo['500'],
      },
      {
        'keywordName': 'sys.spacy_product',
        'uiColor': material.blue['500'],
      },
      {
        'keywordName': 'sys.spacy_event',
        'uiColor': material.lightBlue['500'],
      },
      {
        'keywordName': 'sys.spacy_work_of_art',
        'uiColor': material.cyan['500'],
      },
      {
        'keywordName': 'sys.spacy_law',
        'uiColor': material.teal['500'],
      },
      {
        'keywordName': 'sys.spacy_language',
        'uiColor': material.green['500'],
      },
      {
        'keywordName': 'sys.spacy_money',
        'uiColor': material.lightGreen['500'],
      },
      {
        'keywordName': 'sys.spacy_quantity',
        'uiColor': material.lime['500'],
      },
      {
        'keywordName': 'sys.spacy_cardinal',
        'uiColor': material.yellow['500'],
      },
      {
        'keywordName': 'sys.spacy_ordinal',
        'uiColor': material.amber['500'],
      },
      {
        'keywordName': 'sys.spacy_date',
        'uiColor': material.orange['500'],
      },
      {
        'keywordName': 'sys.spacy_time',
        'uiColor': material.deepOrange['500'],
      },
      {
        'keywordName': 'sys.spacy_percent',
        'uiColor': material.brown['500'],
      },
      {
        'keywordName': 'sys.duckling_amount-of-money',
        'uiColor': material.blueGrey['500'],
      },
      {
        'keywordName': 'sys.duckling_distance',
        'uiColor': material.red['500'],
      },
      {
        'keywordName': 'sys.duckling_duration',
        'uiColor': material.pink['500'],
      },
      {
        'keywordName': 'sys.duckling_email',
        'uiColor': material.purple['500'],
      },
      {
        'keywordName': 'sys.duckling_number',
        'uiColor': material.deepPurple['500'],
      },
      {
        'keywordName': 'sys.duckling_ordinal',
        'uiColor': material.indigo['500'],
      },
      {
        'keywordName': 'sys.duckling_phone-number',
        'uiColor': material.blue['500'],
      },
      {
        'keywordName': 'sys.duckling_quantity',
        'uiColor': material.lightBlue['500'],
      },
      {
        'keywordName': 'sys.duckling_temperature',
        'uiColor': material.cyan['500'],
      },
      {
        'keywordName': 'sys.duckling_time',
        'uiColor': material.teal['500'],
      },
      {
        'keywordName': 'sys.duckling_url',
        'uiColor': material.green['500'],
      },
      {
        'keywordName': 'sys.duckling_volume',
        'uiColor': material.lightGreen['500'],
      },
    ]),
  },
});
