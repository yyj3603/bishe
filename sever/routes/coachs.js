var express = require('express');
var router = express.Router();
var Coach = require('../models/coachs');
router.get('/test',async (req,res)=>{
    res.json({
        data:'hello'
    })
});
/**查询教练列表**/
router.get("/list",async (req,res)=>{
   let doc = await Coach.find();
   console.log('data'+doc);
   if(doc){
       res.json({
           status:'0',/**0代表成功，1代表失败 */
           msg:'',
           result:{
               count:doc.length,/**总条数 */
               list:doc/**doc是查出来的列表集合 */
           }
       })
   }else{
       res.json({
           result:0
       })
   }

//     let page = parseInt(req.param("page"));/**页码 */
//     let pageSize = parseInt(req.param("pageSize"));/**一页多少条数据 */
//         // let sort = req.param("sort");/**将sort作为实现排序的参数，req.param获取前端传过来的参数 */
//     let params = {};
//     console.log(`请求教练界面数据成功了`)
//     let skip = (page-1)*pageSize;/**计算分页的公式，当前页码减去1，乘以pageSize,实际上skip就是个索引值 */
//     let coachsModal  = Coachs.find(params).skip(skip).limit(pageSize);/**find查找所有数据,.skip是默认跳过几条数据 */
// /**find查找所有数据,.skip是默认跳过几条数据 */
//     console.log(`coachsList进来了`)
//     coachsModal.exec(function (err,doc) {
//         if(err) {
//             res.json({
//                 status:'1',
//                 msg:err.message
//             });
//         }else{
//             res.json({
//                 status:'0',/**0代表成功，1代表失败 */
//                 msg:'',
//                 result:doc
//             })
//         }
//     })
});
/**给教练列表添加学生**/
router.post("/addStudent",(req,res,next)=>{
    let userId = req.cookies.userId;
    let userName = req.cookies.userName;
    let coachId = req.body.coachId;
    console.log(`addStudent接口成功了，userId为${userId} userName为${userName},教练Id为${coachId}`)
    Coach.update({coachId:coachId},{
        $addToSet: {
            'coachStudents':{
                'userId':userId,
                'userName':userName
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
                result:doc,
            })
        }
    })
});
/**删除该名教练**/
router.post("/delCoach",(req,res)=>{

    let coachRow = req.body.row;
    console.log(`删除的教练ID和姓名为：${coachRow.coachId},${coachRow.coachName}`);
    Coach.remove(coachRow,function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message,
                result:''
            })
            console.error(err)
        }else{
            res.json({
                status:'0',
                msg:'',
                result:'suc'
            });
            console.error("用户删除成功"+doc)
        }
    })

})
module.exports = router;