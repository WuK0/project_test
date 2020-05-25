var path = require('path');
var fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var session = require('express-session')
const app = express();
var apiRouter = require('./routes/api');
var userRouter = require("./routes/user");
var mongoose = require("./routes/database.js");
var manModel = mongoose.manModel;

var config = require('./config/config.json');





mongoose.connection.on('connected', function () {
    console.log('Mongoose connection open');
});
mongoose.connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose connection disconnected');
});



//设置跨域访问
app.all('*', function (req, res, next) {
    if(req.headers.origin) {
        res.header("Access-Control-Allow-Origin", `${req.headers.origin}`);
    } else {
    res.header("Access-Control-Allow-Origin", `*`);
    }
  	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  	res.header("Access-Control-Allow-Credentials", "true");
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,x-access-token, x-access-site");
  	res.header("Access-Control-Expose-Headers", "*");
    if(req.method === "OPTIONS") {
      return res.end();
  }
  next();
});

// view engine setup
app.set('views', path.join(__dirname, '/views'));
//app.set('view engine', 'html');
//app.engine("html",require("ejs").__express);
app.set('view engine', 'ejs');
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ limit: '50mb',extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));



app.use(session({
	name:'dengluyi',
	secret:'hello world',//cookie签名 这个属性是必须的 具体配置和`cookie-parser`一样
    saveUninitialized:true, // 是否自动初始化 默认为true
    resave:false,// 当用户session无变化的时候依然自动保存
    cookie:{ // cookie的信息具体操作和`cookie-parser`一样
    	maxAge:1800000// 30分钟后过期
    },
    rolling:true// 每次请求的时候覆写cookie
}));



app.use('/api',apiRouter);
app.use("/open",userRouter);

app.get('/manage',function(req, res, next){
	if(!req.session.userName){
		return res.redirect(config.base_url);
	};
	manModel.find({"username":req.session.userName},function(err,userdoc){
		if(err){
			return res.redirect(config.base_url);
		}
		if(userdoc.length==0){
			return res.redirect(config.base_url);
		}
		res.sendFile(path.join(__dirname, './routes','manage.html'));
	});
});

app.get('/pii_manage',function(req, res, next){
	console.log("pii_manage");
	if(!req.session.userName){
		return res.redirect(config.base_url);
	};
	manModel.find({"username":req.session.userName},function(err,userdoc){
		if(err){
			return res.redirect(config.base_url);
		}
		if(userdoc.length==0){
			return res.redirect(config.base_url);
		}
		res.sendFile(path.join(__dirname, './routes','pii_manage.html'));
	});
});

app.get('/url_manage',function(req, res, next){
	if(!req.session.userName){
		return res.redirect(config.base_url);
	};
	manModel.find({"username":req.session.userName},function(err,userdoc){
		if(err){
			return res.redirect(config.base_url);
		}
		if(userdoc.length==0){
			return res.redirect(config.base_url);
		}
		res.sendFile(path.join(__dirname, './routes','url_manage.html'));
	});
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
	//res.status(500);
  	res.sendFile(path.join(__dirname, './public','404.html'));
});
/*
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
*/
var server = app.listen(config.port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
})