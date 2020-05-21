var mongoose = require('mongoose');

/**对应模型的字段，字段需要和数据库对应起来**/
var subjectSchema = new mongoose.Schema({
    "subjectId" : String,
    "subjectName" : String,
    "role" : String,
    "startTime" : String,
    "endTime" : String,
    "productImage" : String,
    "productUrl" : String,
    "coachName" : String,
    "coachId" : String,
    "subjectPrice" : Number,
});

module.exports = mongoose.model("Subject",subjectSchema)


