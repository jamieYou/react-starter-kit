export default function decoder(text) {
  if (/^(\d+|\d*\.\d+)$/.test(text)) return parseFloat(text)
  const keywords = { true: true, false: false, null: null, undefined: undefined }
  if (text in keywords) return keywords[text]
  try {
    return decodeURIComponent(text.replace(/\+/g, ' '))
  } catch (err) {
    return text
  }
}
