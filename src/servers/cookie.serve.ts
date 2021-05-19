let overTime = 30 * 86400000

let options = {
  maxAge: overTime,
  expires: new Date(new Date().getTime() + overTime),
  sameSite: 'lax'
}

module.exports = function setCookie(res: any, key: string, value: any){
  res.cookie(key, value, options);
}
