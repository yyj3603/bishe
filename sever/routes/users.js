var express = require('express');
var router = express.Router();
require('./../util/util');
/*获取user模型*/
var User = require('./../models/user');
/**用来显示日期的插件**/
var dtime = require('time-formater');
/* GET users listing.   get用户列表 */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
/*本文件的路由都是一级路由users下的二级路由开始*/
/*next代表什么都不处理，继续往后流转*/
router.post("/login",(req,res,next)=>{
  var param = {
    /*取得用户名和密码*/
    userName:req.body.userName,
    userPwd:req.body.userPwd
  };

  /*通过获取到的user模型 操作mongoose，通过mongoose操作mongoDB的api*/
  User.findOne(param,(err,doc)=>{
    /*判断err有没有值，如果有值说明报错了*/
    if(err) {
      res.json({
        status:"1",
        msg:err.message

      });
    }else{
      /*如果doc为true说明已经获取到了这个用户了*/
      if(doc) {
        /*存到cookie*/
        res.cookie("userId",doc.userId,{
          path:'/',
          maxAge:1000*60*60/*cookie的周期 1000ms*60*60=1小时*/
        });
        res.cookie("userName",doc.userName,{
          path:'/',
          maxAge:1000*60*60/*cookie的周期 1000ms*60*60=1小时*/
        });
        /**存到session需要通过req去存，因为session是客户端发过来的请求*/
        // req.session.user = doc;
        res.json({
          status:'0',
          msg:'',
          result:{
            userName:doc.userName
          }
        })
      }
    }
  });
});

/*登出接口*/
router.post("/logout",(req,res,next)=>{
  res.cookie("userId","",{
    path:"/",
    maxAge:-1/*使失效*/
  });
  /*往服务端去输出*/
  res.json({
    status:"0",
    msg:'',
    result:''
  })
});
/*通过校验拿到用户信息*/
router.get("/checkLogin",(req,res,next)=>{
  if(req.cookies.userId) {
    res.json({
      status:'0',
      msg:'',
      result:req.cookies.userName || ''
    });
  }else{
    res.json({
      status:'1',
      msg:'未登录',
      result:''
    });
  }
});
/*查询顾客列表*/
router.get("/list",(req,res,next)=>{
  let page = parseInt(req.param("page"));/**页码 */
  let pageSize = parseInt(req.param("pageSize"));/**一页多少条数据 */

  let params = {};

  let skip = (page-1)*pageSize;/**计算分页的公式，当前页码减去1，乘以pageSize,实际上skip就是个索引值 */
  let usersModel = User.find(params).skip(skip).limit(pageSize);/**find查找所有数据,.skip是默认跳过几条数据 */
  usersModel.exec(function(err,doc){
    if(err) {
      res.json({
        status:'1',
        msg:err.message
      });
    }else{
      console.log("doc"+doc);
      res.json({
        status:'0',/**0代表成功，1代表失败 */
        msg:'',
        result:{
          count:doc.length,/**总条数 */
          list:doc/**doc是查出来的列表集合 */
        }
      })
    }
  })
});
/*查询购物车商品数量*/
router.get("/getCartCount",(req,res,next)=>{
  if(req.cookies && req.cookies.userId) {
    var userId = req.cookies.userId;
    User.findOne({userId:userId},(err,doc)=>{
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
        /*拿到购物车列表*/
        var cartList = doc.cartList;
        let cartCount =0;
        cartList.map((item)=>{
          cartCount += parseInt(item.productNum);
        })
        res.json({
          status:'0',
          msg:'',
          result:cartCount
        })
      }
    })
  }
})

/*查询当前用户的购物车数据*/
router.get("/cartList",(req,res,next)=>{
/*先拿到用户的cookie*/
  var userId = req.cookies.userId;
  /*通过User模型找到当前的用户*/
  User.findOne({userId:userId},(err,doc)=>{
    if(err) {
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      if(doc){
        /*如果doc是true就代表取得用户信息了*/

        res.json({
          status:'0',
          msg:'',
          result:doc.cartList
        })
      }
    }
  })
});

//购物车删除
router.post("/cartDel",(req,res,next)=>{
  var userId = req.cookies.userId;
  var productId = req.body.productId;
  /*mongoose的API update*/
  User.update({
    userId:userId?100000077:'',/*更新的条件:用户ID为100000077*/
  },{
    $pull:{/*要删除的数组元素*/
      'cartList':{
        'productId':productId
      }
    }
  },(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:'',
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'suc',
      })
    }
  });
});

//控制购物车商品数量的修改
router.post("/cartEdit",(req,res,next)=>{
  var userId = req.cookies.userId;
  var productId = req.body.productId;
  var productNum = req.body.productNum;
  var checked = req.body.checked;
  User.update({
    "userId":userId,
    "cartList.productId":productId
  },{
    "cartList.$.productNum":productNum,
    "cartList.$.checked":checked,
  },(err,doc)=>{
    if(err) {
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'suc'
      })
    }
  });
});

/*控制购物车全选*/
router.post("/editCheckAll",(req,res,next)=>{
  var userId = req.cookies.userId;
  var checkAll = req.body.checkAll?'1':'0';
  User.findOne({userId:userId},(err,user)=>{
    if(err) {
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      /*判断有没有拿到当前的用户数据*/
      if(user){

        user.cartList.forEach((item)=>{
          item.checked = checkAll;
        })
        user.save((err1,doc)=>{
          if(err1){
            res.json({
              status:'1',
              msg:err1.message,
              result:''
            })
          }else{
            res.json({
              status:'0',
              msg:'',
              result:'suc'
            })
          }
        })
      }
    }
  });
});

/*查询用户地址接口*/
router.get("/addressList",(req,res,next)=>{
  var userId = req.cookies.userId;
  User.findOne({userId:userId},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:doc.addressList
      })
    }
  });
});

//设置默认地址的接口
router.post("/setDefault",(req,res,next)=>{
  var userId = req.cookies.userId;
  var addressId = req.body.addressId;
  /*如果addressId没传回来抛出错误（一般不会发生这种情况）*/
  if(!addressId){
    res.json({
      status:'1003',
      msg:'addressId is null',
      result:''
    })
  }else{
    User.findOne({userId:userId},(err,doc)=>{
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        })
      }else{
        /*拿到了地址列表*/
        var addressList = doc.addressList;
        addressList.forEach((item)=>{
          if(item.addressId==addressId){
            item.isDefault=true;
          }else{
            item.isDefault=false;
          }
        });

        doc.save((err1,doc1)=>{
          if(err1){
            res.json({
              status:'1',
              msg:err.message,
              result:''
            })
          }else{
            res.json({
              status:'0',
              msg:'',
              result:''
            })
          }
        })
      }
    })
  }

});

/*删除地址接口*/
router.post("/delAddress",(req,res,next)=>{
  var userId = req.cookies.userId;
  var addressId = req.body.addressId;
  User.update({
    userId:userId
  },{$pull:{
    'addressList':{
      'addressId':addressId
    }
  }
  },(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:''
      });
    }
  })
});

/*创建订单*/
router.post("/payMent",(req,res,next)=>{
  var userId = req.cookies.userId;
  var orderTotal = req.body.orderTotal;
  var addressId = req.body.addressId;
  /*如果addressId没传回来抛出错误（一般不会发生这种情况）*/
    User.findOne({userId:userId},(err,doc)=>{
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        })
      }else{
        var address = '';
        var goodsList = [];
        /*获取当前用户的地址信息*/
        doc.addressList.forEach((item)=>{
          /*两者进行比对，如果相同说明用户当前使用的是这个地址*/
          if(addressId==item.addressId){
            address = item;
          }
        });

        /*获取用户购物车的购买商品*/
        doc.cartList.filter((item)=>{
          if(item.checked=='1'){
            /*是1则为用户要购买的，把对象装到goodsList里*/
            goodsList.push(item);
          }
        });

        /*随便创建一个独属于这个平台的码*/
        var platform ='622';
        /*生成一个0-9的随机数*/
        var r1 = Math.floor(Math.random()*10);
        var r2 = Math.floor(Math.random()*10);

        /*生成一个16位数字的系统时间*/
        var sysDate = new Date().Format('yyyyMMddhhmmss');
        /*订单的创建时间*/
        var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
        /*得到一个订单id*/
        var orderId = platform+r1+sysDate+r2;
        var order = {
          orderId:orderId,
          orderTotal:orderTotal,
          addressInfo:address,
          goodsList:goodsList,
          orderStatus:'1',/*订单状态*/
          createDate:createDate/*创建的日期*/
        };

        doc.orderList.push(order);
        /*保存这一次的创建*/
        doc.save((err1,doc1)=>{
          if(err1){
            res.json({
              status:'1',
              msg:err1.message,
              result:'',
            });
          }else{
            /*返回后页面展示的数据*/
            res.json({
              status:'0',
              msg:'',
              result:{
                orderId:order.orderId,
                orderTotal:order.orderTotal,
              }
            })
          }
        })


      }
    })
});
/**生成指定区间范围的随机数做userID**/
function randomNum(minNum,maxNum){
  switch(arguments.length){
    case 1:
      return parseInt(Math.random()*minNum+1,10);
      break;
    case 2:
      return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
      break;
    default:
      return 0;
      break;
  }
}
/*添加会员*/
router.post("/addUser",(req,res,next)=>{
  var userName = req.body.userName;
  var userPwd = req.body.userPwd;
  var gender = req.body.gender;
  var age = req.body.age;
  var user = new User({
    userName,userPwd,gender,age,createUserDate:dtime(new Date()).format('YYYY-MM-DD HH:mm'),
    userId:randomNum(100000000,100000999)
  });
  user.save((err,doc)=>{
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:'',
        })
      }else{
        res.json({
          status:'0',
          msg:'',
          result:doc
        })
      }
  })
  // User.save({userName,userPwd,gender,age},(err,doc)=>{
  //   if(err){
  //     res.json({
  //       status:'1',
  //       msg:err.message,
  //       result:'',
  //     })
  //   }else{
  //     res.json({
  //       status:'0',
  //       msg:'',
  //       result:doc
  //     })
  //   }
  // })
});
/**修改会员信息**/
router.post("/editUser",(req,res,next)=>{
  var userId = req.cookies.userId;
  var userName = req.body.userName;
  var userPwd = req.body.userPwd;
  var gender = req.body.gender;
  var age = req.body.age;
  User.update({
    "userId":userId,
  }, {
    "userName": userName,
    "userPwd": userPwd,
    "gender": gender,
    "age": age
  }),(err,doc)=>{

    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:'',
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'suc',
      })
    }
  }
})
/*根据订单ID查询订单信息*/
router.get("/orderDetail", function (req,res,next) {
  var userId = req.cookies.userId,orderId = req.param("orderId");
  User.findOne({userId:userId}, function (err,userInfo) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      var orderList = userInfo.orderList;
      if(orderList.length>0){
        var orderTotal = 0;
        orderList.forEach((item)=>{
          /*两个ID相等说明拿到订单信息了*/
          if(item.orderId == orderId){
            orderTotal = item.orderTotal;
          }
        });
        if(orderTotal>0){
          res.json({
            status:'0',
            msg:'',
            result:{
              orderId:orderId,
              orderTotal:orderTotal
            }
          })
        }else{
          res.json({
            status:'120002',
            msg:'无此订单',
            result:''
          });
        }
      }else{
        res.json({
          status:'120001',
          msg:'当前用户未创建订单',
          result:''
        });
      }
    }
  })
});
module.exports = router;
