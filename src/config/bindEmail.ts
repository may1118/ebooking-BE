export default function(to: string, vertifyCode: number){
  const htmlEmail = `
  <h3>欢迎使用易程ebooking系统</h3>
  <br />
  验证码：${vertifyCode}
  <br />
  请在5分钟之内完成验证~
  `;

  return {
    from: '517537976@qq.com', 
    to, 
    subject: "[易程]绑定邮箱", // Subject line
    html: htmlEmail, // html body  
  }
}