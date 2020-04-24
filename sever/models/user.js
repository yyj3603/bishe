var mongoose = require('mongoose');

/**对应模型的字段，字段需要和数据库对应起来**/
var userSchema = new mongoose.Schema({
  "userId" : String,
  "userName" : String,
  "userPwd" : String,
  "gender" : String,
  "age" : Number,
  "createUserDate" : String,
  "tel" : Number,
  "orderList" : Array,
  "cartList" : [
    {
      "productId" : String,
      "productName" : String,
      "salePrice" : String,
      "productImage" : String,
      "checked" : String,
      "productNum" : String
    }
  ],
  "addressList" : [
    {
      "addressId" : String,
      "userName" : String,
      "streetName" : String,
      "postCode" : Number,
      "tel" : Number,
      "isDefault" : Boolean
    }
  ]
});

module.exports = mongoose.model("User",userSchema)


