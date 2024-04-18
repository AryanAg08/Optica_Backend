const mongoose = require('mongoose');
const schema = mongoose.Schema;


const userSchema = new schema({
    name: {
        type: String,
        required: [true, 'Pass a Name'],
        min: 6,
    },

    email: { 
        type: String,
        required: [true, 'Pass an Email'],
        unique: true,
        min: 6,
        max: 255,

    },
    
    phoneNo: {
        type: Number,
        required: true,
        min: 10,
    },

    batch: {
        type: String,
        required: false,
    },

    enrollmentNo: {
        type: String,
        required: true,
    },

    branch: {
        type: String,
        required: true,
    },

    verified: {
        type: Boolean,
        default: false,
    },
    enrollmentType: {
       type: String,
       required: true,
    },
    college: {
        type: String,
        required: true,
    },
    payment: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true
        }
    }

});


module.exports = mongoose.model('User', userSchema);