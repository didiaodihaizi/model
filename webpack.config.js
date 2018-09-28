const path = require("path"),
  webpack = require("webpack"),
  ExtractTextPlugin = require("extract-text-webpack-plugin"),
  HtmlWebpackPlugin = require('html-webpack-plugin');

var screw_ie8 = false;
var js_css_compress = process.env.NODE_ENV === 'production'
var plugins = [
  new HtmlWebpackPlugin({
    template: './index.ejs',
    filename: 'index.html'
  }),
  new ExtractTextPlugin({
    filename: 'css/[name].[contenthash].css',
  })
];

if (js_css_compress) {
  plugins.push(new webpack.optimize.UglifyJsPlugin())
}
module.exports = {
  entry: "./src/js/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/dist/"
  },
  devServer: {
    host: "0.0.0.0",
    contentBase: path.join(__dirname, "./"),
    publicPath: "/dist/",
    hot: screw_ie8,
    inline: screw_ie8
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src')
    }
  },
  plugins: plugins,
  module: {
    rules: [
      {
        test: /\.ejs$/,
        loader: 'underscore-template-loader'
      },
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, "src")
        ],
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.js$/,
        enforce: "post",
        loader: "es3ify-loader"
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: js_css_compress //css压缩
              }
            }
          ]
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: js_css_compress //css压缩
              }
            },
            {
              loader: 'sass-loader',
              options: {
                minimize: js_css_compress //css压缩
              }
            },
          ]
        })
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192&name=images/[name][hash].[ext]'
      }
    ]
  }
};