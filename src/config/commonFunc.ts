export const addMask = (str: string, type: string) => {
  let maskInfo = ''
  switch (type) {
    case 'NAME':
      const first = str.slice(0, 1)
      const mask = new Array(str.length - 1).join("*")
      maskInfo = first + mask
      break
  }
  return maskInfo
}

export const getLiveStatus = (status: number, type: string) => {
  let status2ZH = ''
  switch (status) {
    case -1:
      status2ZH = type === 'HOTEL' ? '用户已下单，可以接单' : '等待商家接单'
      break
    case 0:
      status2ZH = type === 'HOTEL' ? '等待用户入住' : '等待入住'
      break
    case 1:
      status2ZH = type === 'HOTEL' ? '用户已入住' : '已入住'
      break
    case 2:
      status2ZH = '已完成'
      break
    case 3:
      status2ZH = type === 'HOTEL' ? '用户取消订单' : '您已取消'
      break
    case 4:
      status2ZH = type === 'HOTEL' ? '已拒绝' : '商家已拒绝'
      break
  }
  return status2ZH
}