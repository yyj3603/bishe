var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var ejs = require('ejs');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods');
var customersRouter = require('./routes/customers');
var app = express();

// view engine setup 模板引擎
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);
app.set('view engine', 'html');
//设置使用的中间件
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*捕获登录进行登录拦截*/
app.use((req,res,next)=>{
  //客户端发过来请求之后，通过req.cookies拿cookie值
  if(req.cookies.userId) {
    /*cookie有的话说明用户登录了，程序继续往下走*/
    next();
  }else{
    console.log(`path:${req.path},originalUrl:${req.originalUrl}`);
    /*req.originalUrl获取原始请求URL,req.path获取请求路径*/
    if(req.originalUrl=='/users/login' || req.originalUrl=='/users/logout' || req.path == "/goods/list") {
      /*如果是登录登出操作，程序继续走*/
      next();
    }else{
      /*不是登录登出操作，一律中断，通过res.json输出一个json的格式*/
      res.json({
        status:'10001',
        msg:'当前未登录',
        result:''
      })
    }
  }
})

//设置路由
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods',goodsRouter);
app.use('/customers',customersRouter);

// catch 404 and forward to error handler 捕获404并转发到错误处理程序
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler 错误处理程序
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page 呈现错误页面
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
