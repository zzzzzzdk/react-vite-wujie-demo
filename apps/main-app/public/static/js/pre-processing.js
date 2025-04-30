var parser = new UAParser()

window.UAResult = parser.getResult()

// ie浏览器  直接跳转其他浏览器下载页面
if (UAResult.browser.name == 'IE') {
  window.location.href = './ie.html'
}

// 慎用 谷歌低版本禁用transition动画
// if (UAResult.browser.name == 'Chrome' && parseInt(UAResult.browser.major) < 60) {
//     document.write('<style>*{transition: initial !important;}<\/style>')
// }
