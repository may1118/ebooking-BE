/**
 * insert 信息 语句来自：https://github.com/lizeze/china_region
 * 
 */
import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'

import { queryNoParams } from '../../servers/mysql.server'

const files = fs.readdirSync(__dirname)

files.forEach(async item => {
  const current = path.join(__dirname, item)
  if (current === __filename) {
    console.log('self', item)
    return 
  } else {
    try {
      processLineByLine(current);
    } catch (error) {
      console.log('>>>write error', error)
    }
  }
})

/**
 * 逐行阅读，并且写入数据库
 * @param fileName 文件名称
 */
async function processLineByLine(fileName: string) {
  let input = fs.createReadStream(fileName)
  let rl = readline.createInterface({
    input: input
  });
  rl.on('line', async line => {
    await queryNoParams(line.toString())
    console.log(`Line from file: ${line}`);
  });
  rl.on('close', () => {
    console.log("读取完毕！");
  });
}