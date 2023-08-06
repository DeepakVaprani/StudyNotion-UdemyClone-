const mongoose = require('mongoose');

const tagsSchema = new mongoose.Schema ({
    Name : {
        type:String,
        required : true,
    },
    description : {
        type:String,
        required : true,
    },
    course : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    },
});

module.exports = mongoose.model("Tags",tagsSchema);