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
