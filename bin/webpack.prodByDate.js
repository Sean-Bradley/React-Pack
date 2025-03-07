const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const fs = require('fs')
const InterpolateHtmlPlugin = require('@gozenc/interpolate-html-plugin')
const Dotenv = require('dotenv-webpack')

function getEntry() {
  return fs
    .readdirSync('./src/')
    .filter((file) => file.match(/index\.(js|jsx|tsx)$/))
}

const getFormattedDate = () => {
  const date = new Date()
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}-${month}-${year}`
}

module.exports = {
  mode: 'production',
  performance: {
    hints: false
  },
  entry: './src/' + getEntry(),
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        resolve: {
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        },
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript'
            ]
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|png|jpg|jpeg|gif|svg|ico|glb|gltf|obj|mtl|fbx|stl|ply)$/i,
        type: 'asset/inline'
      },
      {
        test: /\.json$/,
        type: 'json'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../../../public/index.html')
    }),
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
      PUBLIC_URL: ''
    }),
    new Dotenv({ silent: true })
  ],
  output: {
    filename: '[fullhash].bundle.js',
    path: path.resolve(__dirname, `../../../build/${getFormattedDate()}`),
    publicPath: '/'
  }
}
