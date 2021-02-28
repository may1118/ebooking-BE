import * as express from 'express'
var router = express.Router();

import { Request, Response,NextFunction } from 'express'

import sendFormat from '../config/requestSendBack'

import sendEmail from '../controllers/email'

// todo 需要维护一个对象，用来存储验证信息
interface emailVertifyType {
    [key: string]: {
        vertifyCode: number,
        time: number
    }
}
const emailVertify: emailVertifyType = {}
// todo 设置过期事件：5min
const expiredTime = 5 * 60 * 1000;
const pollEmailVertifyObject = 30 * 60 * 1000;

/**
 * /getEmailVertify
 * @params email: 用户的邮箱
 */
router.post('/get', async function(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    // 验证是否是email
    const isEmail = /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/.test(email)
    if(!isEmail) {
        res.send(sendFormat('', false, '邮箱格式不正确'));
    }
    // 随机生成一个数字，并且发送相关邮件
    const vertifyCode = getRandom();
    await sendEmail(email, vertifyCode)

    emailVertify[email] = {
        vertifyCode,
        time: new Date().getTime()
    }
    res.send(sendFormat({
        email,
        vertifyCode
    }))
});

router.post('/vertify', function(req: Request, res: Response, next: NextFunction) {
    const { email, vertify: remoteCode } = req.body
    // 验证是否在对象中有这个条目，并且没有超过事件限制
    const isEmail = /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/.test(email)
    if(!isEmail) {
        res.send(sendFormat('', false, '邮箱格式不正确'));
    }
    // 验证是否正确，并且没有过期
    console.log(emailVertify)
    if(emailVertify[email]) {
        const { vertifyCode: localCode, time } = emailVertify[email]
        if(Number(remoteCode) === Number(localCode)) {
            // 验证是否过期
            if(new Date().getTime() - time < expiredTime){
                // todo 需要存入数据库中
                res.send(sendFormat('success'))
            } else {
                res.send(sendFormat('验证码已过期，请重新获取'))
            }
        } else {
            res.send(sendFormat('验证码不正确'))
        }
    } else {
        res.send(sendFormat('请先获取验证码'))
    }
});

module.exports = router;

// 获得随机数
function getRandom(min = 100000, max = 999999) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}

// 每半小时查询emailVertify的每一项是否有过期的内容，如果有则删除
setInterval(_ => {
    const now = new Date().getTime();
    Object.keys(emailVertify).forEach(key => {
        const { time } = emailVertify[key];
        if(now - time > expiredTime) {
            delete emailVertify[key]
        }
    })
}, pollEmailVertifyObject)