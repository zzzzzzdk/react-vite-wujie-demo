// const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// let config = {
//   dev: {
//     baseApi: 'http://192.168.6.83:9080/DIP/api/v1',
//   },

//   test: {
//     baseApi: 'http://192.168.5.35:9080/DIP/api/v1',
//   }
// }

// let configData = config.dev

// const args = process.argv.slice(2)
// if (args[0] == 'test') {
//   configData = config.test
// }

// let localDir = path.join(__dirname, '../dist')


// let indexHtmlPath = path.join(localDir, 'index.html')
// let file = fs.readFileSync(indexHtmlPath, 'utf8')
// let file2 = file.replace('--zz1--', configData.baseApi)
// fs.writeFileSync(indexHtmlPath, file2)


let exepath = 'deploy.exe'

// if (args[0] == 'test') {
//   exepath += ' -c=true'
// }

console.log('执行方式', exepath)

exec(exepath, {
  cwd: path.join(__dirname)
}, function (error, stdout, stderr) {
  // fs.writeFileSync(indexHtmlPath, file)
  console.log(error)
  console.log(stdout)
  console.log(stderr)
});




