// shrinkPhoto: makes a phone photo small enough to keep many on the phone.
// A camera photo can be 5 MB or more; this resizes it so its longest side
// is at most 1600px and saves it as a JPEG, usually a few hundred KB.
// The photo stays sharp on any phone screen.

const LONGEST_SIDE = 1600
const JPEG_QUALITY = 0.82

export async function shrinkPhoto(file) {
  // createImageBitmap reads the photo the right way up (it follows the
  // camera's rotation info), so portrait photos don't come out sideways.
  const image = await createImageBitmap(file)
  const scale = Math.min(1, LONGEST_SIDE / Math.max(image.width, image.height))
  const width = Math.round(image.width * scale)
  const height = Math.round(image.height * scale)

  // Draw it smaller on an off-screen canvas, then save that as a JPEG.
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d').drawImage(image, 0, 0, width, height)
  image.close()

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not save the photo'))), 'image/jpeg', JPEG_QUALITY)
  })
}

// brightnessOf: how bright a set of pixels looks, 0 (black) to 1 (white).
// pixels is the list a canvas gives back: red, green, blue, alpha, repeated.
// Each pixel counts green most, then red, then blue, because that's how
// bright each color looks to the eye (the standard Rec. 709 weights).
export function brightnessOf(pixels) {
  let sum = 0
  const count = pixels.length / 4
  for (let i = 0; i < pixels.length; i += 4) {
    sum += 0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2]
  }
  return count > 0 ? sum / count / 255 : 0
}

// photoBrightness: how bright a photo is overall, 0 to 1. Loci uses it to
// suggest "The Light on Things". The photo is drawn tiny (32 x 32 is plenty
// for an average, and quick), then its pixels are averaged.
const SAMPLE_SIDE = 32
export async function photoBrightness(file) {
  const image = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  canvas.width = SAMPLE_SIDE
  canvas.height = SAMPLE_SIDE
  const context = canvas.getContext('2d')
  context.drawImage(image, 0, 0, SAMPLE_SIDE, SAMPLE_SIDE)
  image.close()
  return brightnessOf(context.getImageData(0, 0, SAMPLE_SIDE, SAMPLE_SIDE).data)
}
