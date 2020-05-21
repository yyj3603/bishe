var express = require('express');
var router = express.Router();
var Subjects = require('../models/subjects');


router.get("/list",(req,res,next)=>{
    console.log(`请求课程列表的请求进来了`)
    Subjects.find(function (err,doc) {
        if(err){
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
    // let subjectsModel = Subjects.find();
    // subjectsModel.exec(function (err,doc) {
    //     if(err){
    //         res.json({
    //             status:'1',
    //             msg:err.message
    //         });
    //     }else{
    //         res.json({
    //             status:'0',/**0代表成功，1代表失败 */
    //             msg:'',
    //             result:{
    //                 count:doc.length,/**总条数 */
    //                 list:doc/**doc是查出来的列表集合 */
    //             }
    //         })
    //     }
    // })
})

module.exports = router;