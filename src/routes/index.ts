var path = require('path')
var fs = require('fs')
/**
 * 可以写一个循环，读取该文件夹下的文件，循环注入到app中
 * app.use('/xxx', xxx);
 */

module.exports = function (app: any){
  var currentDirPath = __dirname
  var routes =  fs.readdirSync(currentDirPath, 'utf-8')

  routes.forEach((item:string) => {
    if(item !== 'index.ts'){
      let eachPath = path.join(currentDirPath, item);
      let eachRouter = require(eachPath);
      let eachRouterName = item.substr(0, item.lastIndexOf('.'))
      console.log('eachRouterName: ', eachRouterName)
      app.use(`/${eachRouterName}`, eachRouter)
    }
  })
}