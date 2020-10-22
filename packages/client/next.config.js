const path = require('path')
const appRootPath = require('app-root-path')
process.env.NODE_CONFIG_DIR = path.join(appRootPath.path, 'packages/client/config')
const config = require('config')
const withSass = require('@zeit/next-sass')
const withImages = require('next-images')

module.exports = withImages(
  withSass({
    /* config options here */
    publicRuntimeConfig: config.get('publicRuntimeConfig'),
    env: {
      API_MEDIA_ROUTE: process.env.API_MEDIA_ROUTE,
      API_MEDIA_SEARCH_ROUTE: process.env.API_MEDIA_SEARCH_ROUTE,
      API_META_ROUTE: process.env.API_META_ROUTE,
      API_PROJECTS_ROUTE: process.env.API_PROJECTS_ROUTE,
      API_RESOLVE_MEDIA_ROUTE: process.env.API_RESOLVE_MEDIA_ROUTE,
      API_SCENES_ROUTE: process.env.API_SCENES_ROUTE,
      API_SERVER_ADDRESS: process.env.API_SERVER_ADDRESS,
      API_SERVER: process.env.API_SERVER,
      API_SOCKET_ENDPOINT: process.env.API_SOCKET_ENDPOINT,
      IS_XR3: process.env.IS_XR3 === 'true',
      USE_DIRECT_UPLOAD_API: process.env.USE_DIRECT_UPLOAD_API === 'true',
      USE_HTTPS: process.env.USE_HTTPS === 'true',
    },
    dir: './',
    distDir: './.next',
    webpack(config, { isServer }) {
      config.resolve.alias.utils = path.join(__dirname, 'utils')
      if (!isServer) { // Fixes dot env fs error
        config.node = {
          fs: 'empty'
        }
      }
      config.module.rules.push(
        /*
        {
          test: /\.m?js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                'next/babel'
              ]
            }
          }
        },
        */
        {
          test: /\.(eot|woff|woff2|ttf)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 100000,
              name: '[name].[ext]'
            }
          }
        },
        {
        test: /\.(world)(\?.*$|$)/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name]-[hash].[ext]",
            outputPath: "editor/assets/templates"
          }
        }
      },
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: { allowTsInNodeModules: true },
        }
      })

      config.module.rules.push({
        test: /\.(glb)(\?.*$|$)/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name]-[hash].[ext]",
            outputPath: "editor/assets/models"
          }
        }
      })
      config.module.rules.push({
        test: /\.(gltf)(\?.*$|$)/,
        use: {
          loader: "gltf-webpack-loader",
          options: {
            name: "[name]-[hash].[ext]",
            outputPath: "editor/assets/models"
          }
        }
      })
      config.module.rules.push({
        test: /\.(bin)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name]-[hash].[ext]",
              outputPath: "editor/assets/models"
            }
          }
        ]
      })
      config.module.rules.push({
        test: /\.(glsl|vert|fs|frag)$/,
        loader: 'ts-shader-loader'
      })
      config.module.rules.push({
        test: /\.(mp4|webm)(\?.*$|$)/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name]-[hash].[ext]",
            outputPath: "editor/assets/videos"
          }
        }
      })
      config.module.rules.push({
        test: /\.worker\.js$/,
        include: path.join(__dirname, "src"),
        loader: "worker-loader",
        options: {
          // Workers must be inlined because they are hosted on a CDN and CORS doesn't permit us
          // from loading worker scripts from another origin. To minimize bundle size, dynamically
          // import a wrapper around the worker. See SketchfabZipLoader.js and API.js for an example.
          name: "editor/assets/js/workers/[name]-[hash].js",
          inline: true,
          fallback: false
        }
      })
      config.module.rules.push({
        test: /\.tmp$/,
        type: "javascript/auto",
        use: {
          loader: "file-loader",
          options: {
            name: "[name]-[hash].[ext]"
          }
        }
      })
      config.module.rules.push({
        test: /\.wasm$/,
        type: "javascript/auto",
        use: {
          loader: "file-loader",
          options: {
            outputPath: "editor/assets/js/wasm",
            name: "[name]-[hash].[ext]"
          }
        }
      })
      return config
    }
  })
)
