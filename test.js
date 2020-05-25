var mongoose = require("mongoose");
var path = require('path');
var fs = require('fs');
const crypto=require('crypto');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
/*
var email = {};
email.selfemail = {
	user: 'leaknotice@denglu.net.cn',
	password: 'WHGo3ZkMMmVeozTu',
};

smtpTransport = nodemailer.createTransport(smtpTransport({
    host: "smtp.exmail.qq.com",
    port: 465,
    secure: true,
    auth: {
        user: email.selfemail.user,
        pass: email.selfemail.password
    }
}));

email.sendmail = function (recipient, subject, html,cb) {
 
    smtpTransport.sendMail({
 
        from: email.selfemail.user,
        to: recipient,
        subject: subject,
        html: html
 
    }, function (err, response) {
        if (err) {
            console.log(err);
            cb(false);
        }else{
        	cb(response);
        }
    });
};

var test1 = function(){
	var filepath = "./email.html";
	var result = ["123","456","789"];
	var sdes = ["alice","bob","jay"];
	fs.readFile(filepath,'utf-8',function(err,htmlstr){
		var data = '';
		var length = result.length;
		for(var i=0; i<length; i++){
			data += '<li>' +  sdes[i] + ' : <a href="' + result[i] + '">' + result[i] + '</a></li>';
		}
		console.log("data");
		var buf = htmlstr.replace("@{data}@",data);
		console.log(buf);
		email.sendmail("1245549353@qq.com","Your personal informations have been leaked",buf,console.log);
	});
};
test1();
*/

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/testdb");


var piiSchema = new mongoose.Schema({
    pii : { type:String },
    urlid : { type:Number, default:1 },
});

var urlSchema = new mongoose.Schema({
	urlid : {type : Number, default:1},
	url : { type:String,required:true, unique:true},
	online : { type:Boolean, default:true},
	description : { type:String},
	date : { type:Date, default:Date.now},
	manager : { type:String,required:true}
});
var turlSchema = new mongoose.Schema({
	url : { type:String,required:true, unique:true},
	verify : { type: Boolean, default:false},
	pass : {type: Boolean, default:false},
	poster : {type:String,required:true}
});
var userSchema = new mongoose.Schema({
    username: { type:String, required:true, unique:true},
    password: { type:String, required:true},
    pii:{ type: Array},
    description:{ type:Array},
    email:{ type:String, default:"email"},
    score:{type:Number,default:0}
  });
var manSchema = new mongoose.Schema({
	username: { type:String, required:true, unique:true},
});

//创建模型，用它来操作数据库中的pii和url集合，指的是整体
piiModel = mongoose.model("pii", piiSchema,"pii");
urlModel = mongoose.model("url", urlSchema,"url");
turlModel = mongoose.model("turl", turlSchema,"turl");
userModel = mongoose.model("user", userSchema,"user");
manModel = mongoose.model("manager", manSchema,"manager");

/*
var filepath = "./1.txt";
var test3 = function(path,urlid,cb){
	if (fs.existsSync(path)) {
		fs.readFile(path,'utf-8',function(err,data){
			if(err){
				return cb(err);
			}else{
				var str = data.split(',');
				for(var i=0; i<str.length;i++){
					var obj=crypto.createHash('sha256');
					obj.update(str[i]);
					var hex = obj.digest('hex');
					var piiEntity = new piiModel({
						pii : hex,
						urlid : urlid,
					});
					piiEntity.save(function(err,doc){
						if(err){
							return cb(err);
						}else{
							return cb(doc);
						}
					})
				}
			}
		});
	};
};
test3(filepath,1,console.log);
*/

var description = "商城县人民政府 2018年5月份城市低保名单";
var url = "http://www.hnsc.gov.cn/html/2018/xianminzhengju_0511/26379.html";
var manager = "wjvpwtXolq";
var test4 = function(urlid,url,online,description,manager,cb){
	var urlEntity = new urlModel({
		urlid : urlid,
		url : url,
		online : online,
		description : description,
		manager : manager
	});
	urlEntity.save(function(err,doc){
		if(err){
			return cb(err);
		}else{
			return cb(doc);
		}
	})
};
test4(1,url,true,description,manager,console.log);

