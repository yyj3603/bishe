var mongoose = require('mongoose');

/**对应模型的字段，字段需要和数据库对应起来**/
var customerSchema = new mongoose.Schema({
    "customerId" : String,
    "customerName" : String,
    "gender" : String,
    "customerPwd" : String,
    "address" : String,
    "createDate" : String,
    "tel" : Number

});

module.exports = mongoose.model("Customer",customerSchema)