const mongoose = require('mongoose');
const { Schema } = mongoose;

const studentSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
    },
    age: {
        type: Number,
        default: 18,
        max:[50, 'You are too old to be a student'],
        min:[5, 'You are too young to be a student'],
    },
    major: {
        type: String,
        required: true,
        default: 'Undecided',
    },
    scholarship: {
        merit: {
            type: Number,
            min: 0,
            max: [5000, 'Merit scholarship is too high'],
            default: 0,
        },
        other: {
            type: Number,
            min: 0,
            default: 0,
        }, 
        },   
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;