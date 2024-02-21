const mongo = require("mongoose");

const req_fields = {
    type: String,
    required: true,
}

const user_info = new mongo.Schema({
    Name: req_fields,
    Email: req_fields,
    PhoneNo: req_fields,
    Batch: req_fields,
    Enrollment: req_fields,
    Branch: req_fields
});

module.exports = mongo.model('UserInfo', user_info);