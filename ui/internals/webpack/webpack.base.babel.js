/**
 * COMMON WEBPACK CONFIGURATION
 */
const material = require('material-colors');
const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
let processEnv = {
  NODE_ENV: JSON.stringify(process.env.NODE_ENV)
};

if (process.env.API_URL) {
  processEnv.API_URL = JSON.stringify(process.env.API_URL);
}
module.exports = (options) => ({
  entry: options.entry,
  output: Object.assign({ // Compile into js/build.js
    path: path.resolve(process.cwd(), 'build'),
    publicPath: '/',
  }, options.output), // Merge with env dependent settings
  module: {
    loaders: [{
      test: /\.js$/, // Transform all .js files required somewhere with Babel
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: options.babelQuery,
    }, {
      // Do not transform vendor's CSS with CSS-modules
      // The point is that they remain in global scope.
      // Since we require these CSS files in our JS or CSS files,
      // they will be a part of our compilation either way.
      // So, no need for ExtractTextPlugin here.
      test: /\.css$/,
      include: /node_modules/,
      loaders: ['style-loader', 'css-loader'],
    }, {
      test: /\.(scss|css)$/,
      exclude: /node_modules/,
      loaders: ['style-loader', 'css-loader', 'sass-loader'],
    }, {
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      loader: 'file-loader',
    }, {
      test: /\.(jpg|png|gif)$/,
      loaders: [
        'file-loader',
        {
          loader: 'image-webpack-loader',
          query: {
            progressive: true,
            optimizationLevel: 7,
            interlaced: false,
            pngquant: {
              quality: '65-90',
              speed: 4,
            },
          },
        },
      ],
    }, {
      test: /\.html$/,
      loader: 'html-loader',
    }, {
      test: /\.json$/,
      loader: 'json-loader',
    }, {
      test: /\.(mp4|webm)$/,
      loader: 'url-loader',
      query: {
        limit: 10000,
      },
    }],
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
    new webpack.NamedModulesPlugin(),
    new Dotenv({
      path: './.env', // Path to .env file (this is the default)
      silent: true //If true, all warnings will be surpressed.

    }),
  ]),
  resolve: {
    modules: ['app', 'node_modules'],
    extensions: [
      '.js',
      '.jsx',
      '.react.js',
    ],
    mainFields: [
      'browser',
      'jsnext:main',
      'main',
    ],
  },
  devtool: options.devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window
  performance: options.performance || {},
  externals: {
    systemEntities: JSON.stringify([
      {
        "entityName": "sys.spacy_person",
        "uiColor": material.red['500']
      },
      {
        "entityName": "sys.spacy_norp",
        "uiColor": material.pink['500']
      },
      {
        "entityName": "sys.spacy_org",
        "uiColor": material.purple['500']
      },
      {
        "entityName": "sys.spacy_gpe",
        "uiColor": material.deepPurple['500']
      },
      {
        "entityName": "sys.spacy_loc",
        "uiColor": material.indigo['500']
      },
      {
        "entityName": "sys.spacy_product",
        "uiColor": material.blue['500']
      },
      {
        "entityName": "sys.spacy_event",
        "uiColor": material.lightBlue['500']
      },
      {
        "entityName": "sys.spacy_work_of_art",
        "uiColor": material.cyan['500']
      },
      {
        "entityName": "sys.spacy_law",
        "uiColor": material.teal['500']
      },
      {
        "entityName": "sys.spacy_language",
        "uiColor": material.green['500']
      },
      {
        "entityName": "sys.spacy_money",
        "uiColor": material.lightGreen['500']
      },
      {
        "entityName": "sys.spacy_quantity",
        "uiColor": material.lime['500']
      },
      {
        "entityName": "sys.spacy_cardinal",
        "uiColor": material.yellow['500']
      },
      {
        "entityName": "sys.spacy_ordinal",
        "uiColor": material.amber['500']
      },
      {
        "entityName": "sys.spacy_date",
        "uiColor": material.orange['500']
      },
      {
        "entityName": "sys.spacy_time",
        "uiColor": material.deepOrange['500']
      },
      {
        "entityName": "sys.spacy_percent",
        "uiColor": material.brown['500']
      },
      {
        "entityName": "sys.duckling_amount-of-money",
        "uiColor": material.blueGrey['500']
      },
      {
        "entityName": "sys.duckling_distance",
        "uiColor": material.red['500']
      },
      {
        "entityName": "sys.duckling_duration",
        "uiColor": material.pink['500']
      },
      {
        "entityName": "sys.duckling_email",
        "uiColor": material.purple['500']
      },
      {
        "entityName": "sys.duckling_number",
        "uiColor": material.deepPurple['500']
      },
      {
        "entityName": "sys.duckling_ordinal",
        "uiColor": material.indigo['500']
      },
      {
        "entityName": "sys.duckling_phone-number",
        "uiColor": material.blue['500']
      },
      {
        "entityName": "sys.duckling_quantity",
        "uiColor": material.lightBlue['500']
      },
      {
        "entityName": "sys.duckling_temperature",
        "uiColor": material.cyan['500']
      },
      {
        "entityName": "sys.duckling_time",
        "uiColor": material.teal['500']
      },
      {
        "entityName": "sys.duckling_url",
        "uiColor": material.green['500']
      },
      {
        "entityName": "sys.duckling_volume",
        "uiColor": material.lightGreen['500']
      }
    ]),
    languages: JSON.stringify([
      {
        value: 'en',
        text: 'English',
      },
      {
        value: 'fr',
        text: 'French',
      },
      {
        value: 'de',
        text: 'German',
      },
      {
        value: 'pt',
        text: 'Portuguese',
      },
      {
        value: 'es',
        text: 'Spanish',
      }
    ]),
  },
});
