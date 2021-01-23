import * as express from 'express'
import * as logger from 'morgan'
import * as cookieParser from 'cookie-parser'
import * as path from 'path'
import * as createError from 'http-errors'

/**
 * interface
 */
import { Express,Request, Response,NextFunction } from 'express'

var addEachRouter = require('./routes/index');
var app: Express = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * 拦截器
 * 请求发送过来的时候，统一进行身份的验证，如果不符合要求需要告知or重定向
 * finish 需要排除是否访问的是登录接口
 */

app.use(function(req: Request, res: Response, next: NextFunction){
  if(req.path === '/login'){
    next();
  } else {
    const cookies = req.cookies;
    if(!cookies || !cookies.login){
      console.log('未登录')
      res.send('please login')
    } else {
      next();
    }  
  }
})


/**
 * 需要注入一个个路由，但是可以放到额外的文件夹中
 */
addEachRouter(app);


// catch 404 and forward to error handler
app.use(function(req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
