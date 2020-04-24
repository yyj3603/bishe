let express = require("express");
let router = express.Router();
let mongoose = require('mongoose');
let Customers = require("../models/customers");

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

/*查询顾客列表*/
router.get("/list",(req,res,next)=>{
    let page = parseInt(req.param("page"));/**页码 */
    let pageSize = parseInt(req.param("pageSize"));/**一页多少条数据 */

    let params = {};

    let skip = (page-1)*pageSize;/**计算分页的公式，当前页码减去1，乘以pageSize,实际上skip就是个索引值 */
    let customersModel = Customers.find(params).skip(skip).limit(pageSize);/**find查找所有数据,.skip是默认跳过几条数据 */
    customersModel.exec(function(err,doc){
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
/*删除顾客*/
router.post("/cusDel",(req,res,next)=>{
    var customerId = req.body.customerId;
     console.log("传入的res.body.customerId的值为"+req.body.customerId)
    /*mongoose的API update*/
    Customers.deleteOne({
        customerId:customerId/*更新的条件*/
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
})
module.exports = router;