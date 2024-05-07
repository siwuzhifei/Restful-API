const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Student = require('./models/student');


mongoose.connect('mongodb://localhost:27017/exampleDB')
.then(() => {console.log('Connected to MongoDB');
})
.catch((err) => {console.log(err)});

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get('/students', async (req, res) => {
    try {
        let studentData = await Student.find({}).exec();
        res.send(studentData);
    } catch (e) {
        return res.status(500).send("error occurred when searching students");
    }
});

app.get('/students/:_id', async (req, res) => {

    try {
        let {_id} = req.params;
        let foundStudent = await Student.findOne({_id}).exec();
        return res.send(foundStudent);
    } catch (e) {
        return res.status(500).send("student not found");
    }
});

app.post('/students', async (req, res) => {
    try {
        let {name,age,major,merit,other} = req.body;
        let student = new Student({name,age,major,
            scholarship:{merit,other,}});
        let saveStudent = await student.save();
        return res.send(
            {message: 'student saved successfully', 
            saveObject: saveStudent,
        });
        } catch (e) {
            return res.status(400).send(e.message);
        }    
    });

app.put('/students/:_id', async (req, res) => {
    try {
        let {_id} = req.params;
        let {name, age, major, merit, other} = req.body;
        let newData = await Student.findOneAndUpdate(
            {_id}, 
            {name, age, major, 
                scholarship:{merit, other}}, 
            {
            new: true,
            runValidators: true, 
            overwrite: true, //http put request need overwrite the whole document
            }
        );
        return res.send(
            {msg: "student updated successfully",
            updatedData:newData});
        }catch (e) {
        return res.status(400).send(e.message);
    }
});

class NewData {
    constructor() {}
    setPropety(key, value) {
        if (key !== 'merit' && key !== 'other'){
            this[key] = value;
        }else {
            this['scholarship.${key}'] = value;
        }
    }
}

app.patch('/students/:_id', async (req, res) => {
    try {
        let {_id} = req.params;
        let newObject = new NewData();
        for (let key in req.body){
            newObject.setPropety(key, req.body[key]);
        } 
    let newData = await Student.findOneAndUpdate({_id}, newObject, {new: true, runValidators: true});
    // patch request only update the fields that are provided in the request, not overwrite the whole document
        return res.send(
            {msg: "student updated successfully",
            updatedData: newData});
    }catch (e) {
        return res.status(400).send(e.message);
    }
});


app.listen(3000, () => {console.log('Server is running on port 3000')});