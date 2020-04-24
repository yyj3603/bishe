var mongoose = require('mongoose')
var Schema = mongoose.Schema;/**Mongoose 的一切始于 Schema。每个 schema 都会映射到一个 MongoDB collection ，并定义这个collection里的文档的构成 */

var productSchema = new Schema({
    "productId":{type:String},
    "productName":String,
    "salePrice":Number,
    "productImage":String,
    "productNum" : Number,
    "checked" : String,
    "goodNum" : Number,
})

module.exports = mongoose.model('Good',productSchema)/**在表中查找Good时会默认加一个s，即查找的会是名字为“goods”的表（collections） */
/**我们要把 schema 转换为一个 Model， 使用 mongoose.model(modelName, schema) 函数： */

/**创建数据模型是mongoose的设计模式，要获取数据，必须先创建模型，然后和数据库的数据进行实体映射。通过模型来进行API的操作 */
