import { httpResponse as interfaceResponse } from '../@types/response.type'

/**
 * 
 * @param data 成功的结果
 */
export function success(data: object, msg?: string): interfaceResponse{
  var response: interfaceResponse = {
    status: 0,
    msg: msg || 'success',
    data
  };
  return response
}

/**
 * 
 * @param msg 失败的提示信息
 */
export function fail(msg: string): interfaceResponse{
  var response: interfaceResponse = {
    status: 1,
    msg,
  };
  return response;
}