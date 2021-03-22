const regexName = /^([0-9a-zA-Z]|_){5,20}$/
const regexPassword = /(?![0-9]+$)(?![a-zA-Z]+$)^[0-9a-zA-Z]{6,20}$/
const regexPhone = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/
const regexEmail = /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/
const regexVertifyCode = /^[0-9]{1,}$/

enum vertifyType{
  NAME,
  PASSWORD,
  PHONE,
  EMAIL,
  CODE
}
interface vertifyArrInterFace {
  type: vertifyType;
  val: string
}

function isVertifyArr(vertifyArr: vertifyArrInterFace[]) {
  try {
    let flagArr: Array<Boolean> = []
    vertifyArr.forEach(item => {
      let regex: RegExp;
      const { type, val } = item
      switch (type) {
        case vertifyType.NAME:
          regex = regexName
          break;
        case vertifyType.PASSWORD:
          regex = regexPassword
          break;
        case vertifyType.PHONE:
          regex = regexPhone
          break;
        case vertifyType.EMAIL:
          regex = regexEmail
          break;
        case vertifyType.CODE:
          regex = regexVertifyCode
          break;
        default:
          console.log('>>>type error.')
          throw 'error'
          break;
      }
      flagArr.push(regex.test(val))
    })
    return flagArr.findIndex(item => item === false) === -1 ? true : false
  } catch (error) {
    return false
  }
}
function isVertify(vertifyArr: vertifyArrInterFace) {

}

export { vertifyType, vertifyArrInterFace, isVertifyArr, isVertify }