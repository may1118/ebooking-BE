import * as crypto from "crypto";

const algorithm = 'aes-128-cbc'
const key = '9vApxLk5G3PAsJrM'
const iv = 'FnJL7EDzjqWjcaY9'

let bufferKey = Buffer.from(key, 'utf8');
let bufferIv = Buffer.from(iv, 'utf8');

// 加密
export function encrypt(src: string) {
  let sign = '';
  const cipher = crypto.createCipheriv(algorithm, bufferKey, bufferIv);
  sign += cipher.update(src, 'utf8', 'hex');
  sign += cipher.final('hex');
  return sign;
}

// 解密
export function decrypt(sign: string) {
  let src = '';
  const cipher = crypto.createDecipheriv(algorithm, bufferKey, bufferIv);
  src += cipher.update(sign, 'hex', 'utf8');
  src += cipher.final('utf8');
  return src;
}

// console.log(encrypt('test'))
// console.log(decrypt('eba1279512c5eb143f1b75e73e6e5e9e'))