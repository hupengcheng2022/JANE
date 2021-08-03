var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session=require('express-session');
var bodyparser=require('body-parser');

var indexRouter=require('./routes/index');
var adminRouter=require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',require('express-art-template'));
app.set('view engine','html');

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//session处理中间件
app.use(session({
  secret: 'jerotjos,dfgd.,-gdgdsf',
  resave: true,
  saveUninitialized: true,
  cookie:{
    maxAge:60*60*1000      //1小时
  }
}));

//是否已登录
app.use(function(req,res,next){
  let url=req.url;
  if(url=='/'
      || url=='/mangoods'
      || url=='/womangoods'
      || url=='/regist'
      || url=='/doLogin'
      || url=='/doRegist'
      || url=='/retrievepsw'
      || url=='/doretrievepsw'
      || url=='/resetpsw'
      || url=='/about'
      || url.startsWith('/goods')
      || url.startsWith('/search'))
  {
    next();
  }else{
    if(req.session.curuser){
      next();
    }else{
      res.render('login',{msg:''});
    }
  }
});

app.use('/', indexRouter);
app.use('/admin',adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next();
});



app.listen(3000,'127.0.0.1');
//module.exports = app;
