const { default: mongoose } = require("mongoose");

const RoleSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    }
});

RoleSchema.set("timestamps", true);

module.exports = mongoose.model("Role", RoleSchema);