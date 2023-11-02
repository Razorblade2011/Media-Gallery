import sizeOf from 'image-size'
import sharp from 'sharp'

// создаёт превью по переданному пути (включая название и расширение файла)
export const createPreviewImage = (originalFilePath, previewFilePath) => {
  sharp(originalFilePath)
    .resize(300)
    .toFile(previewFilePath, (err, info) => {
      if (err) {
        console.log(err)
        return err
      }
    })
  return `Файл превью ${previewFilePath} создан.`
}

// собирает инфу о файле
export const getImageInfo = (originalFilePath) => {
  const { width, height } = sizeOf(originalFilePath) // image dimentions
  return { width, height }
}
