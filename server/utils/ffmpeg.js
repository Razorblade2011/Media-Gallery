import ffprobe from 'ffprobe'
import ffmpeg from 'fluent-ffmpeg'

// const ffprobePath = process.env.FFPROBE_PATH || '/usr/bin/ffprobe'
// const ffmpegPath = process.env.FFMPEG_PATH || '/usr/bin/ffmpeg'
const ffprobePath = process.env.FFPROBE_PATH || 'C:/ffmpeg/bin/ffprobe.exe'
const ffmpegPath = process.env.FFMPEG_PATH || 'C:/ffmpeg/bin/ffmpeg.exe'

ffmpeg.setFfprobePath(ffprobePath)
ffmpeg.setFfmpegPath(ffmpegPath)

// возаращает размеры кадра и продолжительность видео файла
export const getVideoDimentions = (filePath) => {
  return new Promise((resolve, reject) => {
    return ffprobe(
      filePath,
      { path: process.env.FFPROBE_PATH },
      function (err, info) {
        if (err) return reject(err)
        if (info.streams[0].width && info.streams[0].height) {
          return resolve({
            width: info.streams[0].width,
            height: info.streams[0].height,
            duration: info.streams[0].duration,
          })
        }
        if (info.streams[1].width && info.streams[1].height) {
          return resolve({
            width: info.streams[1].width,
            height: info.streams[1].height,
            duration: info.streams[1].duration,
          })
        }
      }
    )
  })
}

// возвращает размеры для превью изображения видефайла в зависимости от соотношения сторон
export const getVideoScreenshotSize = (width, height) => {
  if (width > height) {
    const previewHeight = Math.floor(height / (width / 300))
    return {
      previewWidth: 300,
      previewHeight,
    }
  } else {
    const previewWidth = Math.floor(width / (height / 300))
    return {
      previewWidth,
      previewHeight: 300,
    }
  }
}

// создание превью изображения для видеофайла на отметке в 10% от продолжительности видео
export const createVideoScreenshot = (
  filePath,
  fileName,
  previewPath,
  previewWidth,
  previewHeight
) => {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(filePath)
      .on('filenames', (filenames) => {
        console.log('Will generate ' + filenames.join(', '))
        console.log(filenames)
      })
      .on('end', () => {
        console.log('Screenshots taken')
        resolve('Screenshots taken')
      })
      .on('error', (error) => {
        reject('Cannot process video: ' + error.message)
        console.log(error)
      })
      .screenshot({
        timestamps: ['10%'],
        folder: previewPath,
        size: `${previewWidth}x${previewHeight}`,
        filename: `preview_${fileName}.png`,
      })
  })
}

const getVideoInfo = (inputPath) => {
  return new Promise((resolve, reject) => {
    return ffmpeg.ffprobe(inputPath, (error, videoInfo) => {
      if (error) {
        return reject(error)
      }

      const { duration, size } = videoInfo.format
      if (duration && size) {
        return resolve({
          size,
          durationInSeconds: Math.floor(duration),
        })
      }
    })
  })
}

const getStartTimeInSeconds = (
  videoDurationInSeconds,
  fragmentDurationInSeconds
) => {
  // by subtracting the fragment duration we can be sure that the resulting
  // start time + fragment duration will be less than the video duration
  const safeVideoDurationInSeconds =
    videoDurationInSeconds - fragmentDurationInSeconds

  // if the fragment duration is longer than the video duration
  if (safeVideoDurationInSeconds <= 0) {
    return 0
  }

  return getRandomIntegerInRange(
    0.25 * safeVideoDurationInSeconds,
    0.75 * safeVideoDurationInSeconds
  )
}

const getRandomIntegerInRange = (min, max) => {
  const minInt = Math.ceil(min)
  const maxInt = Math.floor(max)

  return Math.floor(Math.random() * (maxInt - minInt + 1) + minInt)
}

export const createXFramesPreview = (
  inputPath,
  outputPattern,
  numberOfFrames
) => {
  return new Promise(async (resolve, reject) => {
    const { durationInSeconds } = await getVideoInfo(inputPath)

    // 1/frameIntervalInSeconds = 1 frame each x seconds
    const frameIntervalInSeconds = Math.floor(
      durationInSeconds / numberOfFrames
    )

    return ffmpeg()
      .input(inputPath)
      .outputOptions([`-vf fps=1/${frameIntervalInSeconds}`])
      .output(outputPattern)
      .on('end', resolve)
      .on('error', reject)
      .run()
  })
}

export const createFragmentPreview = async (
  inputPath,
  outputPath,
  fragmentDurationInSeconds = 4
) => {
  return new Promise(async (resolve, reject) => {
    const { durationInSeconds: videoDurationInSeconds } = await getVideoInfo(
      inputPath
    )

    const startTimeInSeconds = getStartTimeInSeconds(
      videoDurationInSeconds,
      fragmentDurationInSeconds
    )

    return ffmpeg()
      .input(inputPath)
      .inputOptions([`-ss ${startTimeInSeconds}`])
      .outputOptions([`-t ${fragmentDurationInSeconds}`])
      .noAudio()
      .output(outputPath)
      .on('end', resolve)
      .on('error', reject)
      .run()
  })
}
