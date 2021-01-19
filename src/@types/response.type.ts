/**
 * 设置返回信息
 * status: 0 成功  1 失败
 * msg：提示信息
 * data：返回的信息
 */
export declare interface httpResponse {
  status: number,
  msg: string,
  data?: object
}