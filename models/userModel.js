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
        // unique: true,
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
        required: true,
    },

    enrollmentNo: {
        type: String,
        required: true,
    },

    branch: {
        type: String,
        required: true,
    },

    // password: {
    //     type: String,
    //     required: true,
    //     min: 2,
    //     max: 1024,
    // },

    verified: {
        type: Boolean,
        default: false,
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