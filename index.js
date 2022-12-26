const express = require('express');

const port = 9000;

const app = express();

const path = require('path');

const mongoose = require('mongoose');

mongoose.set("strictQuery", false);

const db = require('./config/mongoose');

const Admintbl = require('./models/AdminModel');

app.set('view engine','ejs');
app.set('views',path.join(__dirname,"views"));

app.use(express.urlencoded());

app.get('/',(req,res)=>{
    return res.render('admin');
});

app.post('/insertdata',(req,res)=>{
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let gender = req.body.gender;
    let hobby = req.body.hobby;
    let city = req.body.city;
    Admintbl.create({
        name : name,
        email : email,
        password : password,
        gender : gender,
        hobby : hobby,
        city : city
    },(err,data)=>{
        if(err){
            console.log("Record not insert");
            return false;
        }
        console.log("Record successfully insert");
        return res.redirect('/');
    }); 
});

app.get('/view',(req,res)=>{
    Admintbl.find({},(err,record)=>{
        if(err){
            console.log("Record not show");
            return false;
        }
        return res.render('view',{
            allrecord : record
        });
    });
});

app.get('/deletedata/:id',(req,res)=>{
    let deleteid = req.params.id;

    Admintbl.findByIdAndDelete(deleteid,(err,data)=>{
        if(err){
            console.log("Record not delete");
            return false;
        }
        console.log("Record successfully delete");
        return res.redirect('back');
    });

})

app.listen(port,(err)=>{
    if(err){
        console.log("Server not start");
        return false;
    }
    console.log("Server is start on port :- "+port);
})