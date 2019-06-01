export const environment = {
  youtube: {
    mp3Path: './musics/',
  },
  restServer: {
    port: 4300
  },
  mongo: {
    url: 'mongodb://localhost:27017'
  },
  normalization: {
    enable: true,
    command: 'ffmpeg -i <IN> -af dynaudnorm <OUT>'
  },
  player: {
    command: 'mpg123 -vC <FILE>'
  }
}
