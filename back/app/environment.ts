export const environment = {
  youtube: {
    mp3Path: './musics/',
    ffmpegLocation: '/opt/homebrew/bin/ffmpeg'
  },
  restServer: {
    port: 4300
  },
  mongo: {
    url: 'mongodb://localhost:27017'
  },
  normalization: {
    enable: true,
    command: 'ffmpeg -hide_banner -loglevel error -i <IN> -af dynaudnorm <OUT>'
  },
  player: {
    command: 'mpg123 -vC <FILE>'
  }
}
