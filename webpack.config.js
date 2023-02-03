const path    = require("path")
const webpack = require("webpack")
const dotenv  = require('dotenv');

module.exports = () => {
  var env_path = __dirname + '/app/javascript/.env'
  if (process.env.NODE_ENV != 'production') {
    env_path += '.development'
  }
  const env = dotenv.config({path: env_path})

  return {
    mode: "none",
    devtool: "source-map",
    entry: {
      application: "./app/javascript/main.tsx"
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx|)$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {
          test: /\.css$/i,
          use: [
            "style-loader",
            "css-loader",
          ],
          include: [
            path.join(__dirname, 'app/javascript'),
            /node_modules/
          ]
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            "style-loader",
            "css-loader",
            "sass-loader",
          ],
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: ['file-loader']
        },
      ],
    },
    resolve: {
      extensions: ['*', '.js', '.jsx', '.tsx'],
    },
    output: {
      filename: "[name].js",
      sourceMapFilename: "[name].js.map",
      path: path.resolve(__dirname, "app/assets/builds"),
    },
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
      }),
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(env.parsed),
      }),
      new webpack.EnvironmentPlugin({NODE_ENV: 'development'})
    ]
  }
}
