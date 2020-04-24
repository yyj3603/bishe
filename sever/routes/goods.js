var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

//连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/dumall',{useNewUrlParser: true,useUnifiedTopology: true});
//连接成功
mongoose.connection.on("connected",()=>{
    console.log("MongoDB connected success.")
});
//连接失败
mongoose.connection.on("error",()=>{
    console.log("MongoDB connected fail.")
});
//连接断开
mongoose.connection.on("disconnected",()=>{
    console.log("MongoDB connected disconnected.")
});

/*本文件的路由都是一级路由goods下的二级路由开始*/
/*查询商品列表数据*/
router.get("/list",(req,res,next)=>{
     // res.send('hello,goods list');
    let page = parseInt(req.param("page"));/**页码 */
    let pageSize = parseInt(req.param("pageSize"));/**一页多少条数据 */
    let priceLevel = req.param("priceLevel");
    let sort = req.param("sort");/**将sort作为实现排序的参数，req.param获取前端传过来的参数 */
    let params = {};

    var priceGt = '',priceLte = '';/**Gt是大于，Lte是小于 */
    if(priceLevel!=='all'){
        switch (priceLevel) {
            case '0':
                priceGt = 0;priceLte= 100;
                break;
            case '1':
                priceGt = 100;priceLte = 500;
                break;
            case '2':
                priceGt = 500;priceLte = 1000;
                break;
            case '3':
                priceGt = 1000;priceLte = 5000;
                break;
            default:
                break;
        }
        params = {
            salePrice:{
                $gt:priceGt,
                $lte:priceLte
            }
        }
    }

    let skip = (page-1)*pageSize;/**计算分页的公式，当前页码减去1，乘以pageSize,实际上skip就是个索引值 */
    let goodsModel  = Goods.find(params).skip(skip).limit(pageSize);/**find查找所有数据,.skip是默认跳过几条数据 */
    goodsModel.sort({'salePrice':sort});
    goodsModel.exec(function(err,doc){
        if(err) {
            res.json({
                status:'1',
                msg:err.message
            });
        }else{
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
/**查询管理商品界面用的产品数据**/
router.get("/goodsList",(req,res,next)=>{
    let page = parseInt(req.param("page"));/**页码 */
    let pageSize = parseInt(req.param("pageSize"));/**一页多少条数据 */

    // let sort = req.param("sort");/**将sort作为实现排序的参数，req.param获取前端传过来的参数 */
    let params = {};




    let skip = (page-1)*pageSize;/**计算分页的公式，当前页码减去1，乘以pageSize,实际上skip就是个索引值 */
    let productsModel  = Goods.find(params).skip(skip).limit(pageSize);/**find查找所有数据,.skip是默认跳过几条数据 */
    // productsModel.sort({'salePrice':sort});
    productsModel.exec(function(err,doc){
        if(err) {
            res.json({
                status:'1',
                msg:err.message
            });
        }else{
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
})
/**加入到购物车*/
// router.post("/addCart",(req,res,next)=>{
//   var userId = '100000077';var productId = req.body.productId;/*假设这个id的用户已经登录了**/
//   var User = require('../models/user'); /*获取模型,通过模型执行api**/
//   /**只拿当前第一个用户 findOne是monoose中查找指定表的单挑数据，返回一个对象，find查找指定表的所有数据，返回的是数组*/
//   /*拿到用户信息，判断是否存在*/
//   User.findOne({userId:userId},(err,userDoc)=>{
//     if(err) {
//       res.json({
//         status:"1",
//         msg:err.message
//       })
//     }else{
//       if(userDoc) {
//         /**用户存在判断商品信息*/
//         let goodsItem = '';
//         userDoc.cartList.forEach((item)=>{
//           /**后面的productId是传进来的，==说明购物车已经有这条数据了**/
//           if(item.productId==productId){
//             goodsItem = item;
//             item.productNum ++;
//           }
//         });
//         /*goodsItem是true说明购物车已经有了，如果是false就需要插入新的进去*/
//         if(goodsItem){
//           userDoc.save((err2,doc2)=>{
//             if(err2) {
//               res.json({
//                 status:"1",
//                 msg:err2.message
//               })
//             }else{
//               res.json({
//                 status:'0',
//                 msg:'',
//                 result:'suc'
//               })
//             }
//           })
//         }else{
//           Goods.findOne({productId:productId},(err1,doc)=>{
//             if(err1) {
//               res.json({
//                 status:"1",
//                 msg:err1.message
//               })
//             }else{
//               if(doc) {
//                 doc.productNum = 1;/*doc是当前的商品信息，拿到商品信息后加个productNum字段并赋初值为1*/
//                 doc.checked = 1;/**这两个属性必须在models/goods里也加上，不然不会保存到用户的数据库中*/
//                 userDoc.cartList.push(doc);
//                 userDoc.save((err2,doc2)=>{
//                   if(err2) {
//                     res.json({
//                       status:"1",
//                       msg:err2.message
//                     })
//                   }else{
//                     res.json({
//                       status:'0',
//                       msg:'',
//                       result:'suc'
//                     })
//                   }
//                 })
//               }
//             }
//           })
//         }
//
//       }
//     }
//   })
//
//
// });
/**加入到购物车*/
router.post("/addCart",(req,res,next)=>{
    var userId = req.cookies.userId;var productId = req.body.productId;/*假设这个id的用户已经登录了**/
    var User = require('../models/user'); /*获取模型,通过模型执行api**/
    /**只拿当前第一个用户 findOne是monoose中查找指定表的单挑数据，返回一个对象，find查找指定表的所有数据，返回的是数组*/
    /*拿到用户信息，判断是否存在*/
    User.findOne({userId:userId},(err,userDoc)=>{
        if(err) {
            res.json({
                status:"1",
                msg:err.message
            })
        }else{
            if(userDoc) {
                /**用户存在判断商品信息*/
                let goodsItem = '';
                userDoc.cartList.forEach((item)=>{
                    /**后面的productId是传进来的，==说明购物车已经有这条数据了**/
                    if(item.productId==productId){
                        goodsItem = item;
                        item.productNum ++;
                    }
                });
                /*goodsItem是true说明购物车已经有了，如果是false就需要插入新的进去*/
                if(goodsItem){
                    userDoc.save((err2,doc2)=>{
                        if(err2) {
                            res.json({
                                status:"1",
                                msg:err2.message
                            })
                        }else{
                            res.json({
                                status:'0',
                                msg:'',
                                result:'suc'
                            })
                        }
                    })
                }else{
                    Goods.findOne({productId:productId},(err1,doc)=>{
                        if(err1) {
                            res.json({
                                status:"1",
                                msg:err1.message
                            })
                        }else{
                            if(doc) {
                                doc.productNum = 1;/*doc是当前的商品信息，拿到商品信息后加个productNum字段并赋初值为1*/
                                doc.checked = 1;/**这两个属性必须在models/goods里也加上，不然不会保存到用户的数据库中*/
                                userDoc.cartList.push(doc);
                                userDoc.save((err2,doc2)=>{
                                    if(err2) {
                                        res.json({
                                            status:"1",
                                            msg:err2.message
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
                    })
                }

            }
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
/**添加商品**/
router.post("/addProduct",(req,res,next)=>{
    var productName = req.body.productName;
    var salePrice = req.body.salePrice;
    var goodNum = req.body.goodNum;

    var goods = new Goods({
        productName,salePrice,goodNum,
        productId:randomNum(202010000,20209999)
    });
    goods.save((err,doc)=>{
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
})
module.exports = router;
