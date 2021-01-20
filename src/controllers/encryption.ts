import * as crypto from "crypto";

const algorithm = 'aes-128-cbc'
const key = '9vApxLk5G3PAsJrM'
const iv = 'FnJL7EDzjqWjcaY9'

// 加密
function encrypt(src: string) {
  let sign = '';
  let bufferKey = Buffer.from(key, 'utf8');
  let bufferIv = Buffer.from(iv, 'utf8');
  const cipher = crypto.createCipheriv(algorithm, bufferKey, bufferIv);
  sign += cipher.update(src, 'utf8', 'hex');
  sign += cipher.final('hex');
  return sign;
}

// 解密
function decrypt(sign: string) {
  let src = '';
  let bufferKey = Buffer.from(key, 'utf8');
  let bufferIv = Buffer.from(iv, 'utf8');
  const cipher = crypto.createDecipheriv(algorithm, bufferKey, bufferIv);
  src += cipher.update(sign, 'hex', 'utf8');
  src += cipher.final('utf8');
  return src;
}

module.exports = {
  encrypt, // 加密算法
  decrypt // 解密算法
}
