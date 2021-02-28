export default function(data: any, success = true,message?: string) {
    const mes = success ? 'success' : 'fail'
    const res = {
        code: success ? 0 : 1,
        data,
        message: message || mes
    }

    return res;
}