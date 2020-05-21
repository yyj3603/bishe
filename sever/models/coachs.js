var mongoose = require('mongoose');

/**对应模型的字段，字段需要和数据库对应起来**/
var coachSchema = new mongoose.Schema({
    "coachId" : String,
    "coachName" : String,
    "coachGender" : String,
    "coachAge" : Number,
    "coachHeight" : String,
    "coachProjects" : Array,
    "coachStudents":[
        {
            "userId":String,
            "userName":String,
            "gender":String,
            "age":Number,
            "tel" : Number,
            "course":Array
        }],

});

module.exports = mongoose.model("Coach",coachSchema,"coachs")


