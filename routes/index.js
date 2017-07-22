var express = require('express');
var router = express.Router();
var http=require('http');
var MongoClient= require('Mongodb').MongoClient;
var DB_CONN_STR = "mongodb://127.0.0.1:27017/maizuo";
var async=require('async');

router.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By",' 3.2.1');
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});

//router.all('*', function(req, res, next) {
//	res.header("Access-Control-Allow-Origin", "*");
//	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
//	res.header("Access-Control-Allow-Headers", "X-Requested-With");
//	res.header('Access-Control-Allow-Headers', 'Content-Type');
//	next();
//});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//localhost:3000/lunbo
//轮播的接口
router.get('/lunbo',function(req,res){
	
	var time=new Date().getTime();
	
	http.get('http://m.maizuo.com/v4/api/billboard/home?__t='+time,function(response){
		
		var data='';
		
		response.on('data',function(chunk){
			data+=chunk;
		})
		
		response.on('end',function(){
			res.send(data);
		})
	})
})

//首页
router.get('/homePage',function(req,res){
	
	var page=req.query.page;
	var count=req.query.count;
	
	http.get('http://m.maizuo.com/v4/api/film/now-playing?__t=1500346901224&page='+page+'&count='+ count,function(response){
		
		var data='';
		
		response.on('data',function(chunk){
			data+=chunk;
		})
		
		response.on('end',function(){
			res.send(data);
		})
	})
})

//正在热映
router.get('/now_playing',function(req,res){
	
//	var page=req.query.page;
//	var count=req.query.count;
	
	http.get('http://m.maizuo.com/v4/api/film/now-playing?page=1&count=7',function(response){
		
		var data='';
		
		response.on('data',function(chunk){
			data+=chunk;
		})
		
		response.on('end',function(){
			res.send(data);
		})
	})
})

//即将上映
router.get('/comming',function(req,res){
	
//	var page=req.query.page;
	var count=req.query.count;
	
	http.get('http://m.maizuo.com/v4/api/film/coming-soon?page=1&count='+count,function(response){
		
		var data='';
		
		response.on('data',function(chunk){
			data+=chunk;
		})
		
		response.on('end',function(){
			res.send(data);
		})
	})
})
//全部影院
router.get('/cinema',function(req,res){
	
//	var page=req.query.page;
//	var count=req.query.count;

	var time=new Date().getTime();
//			  http://m.maizuo.com/v4/api/cinema?__t=1500429641093
	http.get('http://m.maizuo.com/v4/api/cinema?__t='+time,function(response){
		
		var data='';
		
		response.on('data',function(chunk){
			data+=chunk;
		})
		
		response.on('end',function(){
		
			res.send(data);
		})
	})
})
//详情页
router.get('/detail',function(req,res){
	
	var id=req.query.id;
//	var count=req.query.count;
	var time=new Date().getTime();
//			  http://m.maizuo.com/v4/api/cinema?__t=1500429641093
	http.get('http://m.maizuo.com/v4/api/film/'+ id +'?__t'+time,function(response){
		
		var data='';
		
		response.on('data',function(chunk){
			data+=chunk;
		})
		
		response.on('end',function(){
			res.send(data);
		})
	})
})

router.get('/reg',function(req,res){
//	var username=req.query.username;
//	var password=req.query.password;
	
	var obj = {
		code: 0,
		msg: '登录成功'
	}
	
	MongoClient.connect(DB_CONN_STR,function(err,db){
		if(err){
			obj.msg = '请求出错';
			res.send(obj)
		}else{
			var conn=db.collection('maizuowang');
			
			conn.find({username:req.query.username}).count(function(err,num){
				if(err){
					obj.msg = '请求出错';
					res.send(obj)
				}else{
					if(num>0){
						conn.find(req.query).count(function(error,number){
							if(error){
								res.send('网络异常')
							}else{
								if(number>0){
//									console.log('登录成功')
									obj.msg = '登录成功';
									res.send(obj)
								}else{
//									console.log('请输入正确的手机号或密码')
									obj.msg = '请输入正确的手机号或密码';
									res.send(obj)
								}
							}
						})
					}else{
						conn.save(req.query,function(erro,info){
							if(erro){
//								console.log('注册失败')
								obj.msg = '注册失败';
								res.send(obj)
							}else{
//								console.log('注册成功')
								obj.msg = '注册成功';
								res.send(obj)
							}
						})
					}
				}
			})
			
//			async.series([
//				// 得到评论集合的总条数
//				function(cb) {
//
//					conn.find({username:req.query.username}).count(function(err, num) {
//						if (err) {
//							console.log('查询失败');
//							cb('查询失败');
//						}else{
//							if(num>0){
//								console.log('已经注册');
//								cb('已经注册')
//							}else{
//								console.log('可以注册');
//								cb(null)
//							}
//
//						}
//					})
//				},
//				function(num,cb){
//					conn.save(req.query,function(err,info){
//						if(err){
//							console.log('注册失败');
//							cb('注册失败')
//						}else{
//							console.log('注册成功');
//							cb(null);
//						}
//					})
//				}
//			], function(err, result) {
//				if (err) {
////					console.log(err);
////					console.log(result);
//					res.send(result);
//				} 
//			})
			
			
			
		}
	})
})


module.exports = router;
