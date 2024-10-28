import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.(mp4|webm|ogg)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          },
        },
      ],
    })
    return config
  },
  turbo: {
    loaders: {
      '.mp4': {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
    },
  },
}

export default nextConfig
