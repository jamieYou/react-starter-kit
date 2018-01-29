import FastClick from 'fastclick'

export default function mobileHack() {
  document.addEventListener('DOMContentLoaded', function () {
    FastClick.attach(document.body)
  }, false)

  const setHTMLFont = () => {
    const { innerWidth } = window
    const fontSize = (innerWidth > 768 ? 768 : innerWidth) / 7.5
    document.querySelector('html').style.fontSize = `${fontSize}PX`
  }

  window.onload = window.onresize = setHTMLFont
}
