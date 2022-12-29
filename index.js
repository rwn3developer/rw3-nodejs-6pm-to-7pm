const express = require('express');

const port = 9000;

const app = express();

const path = require('path');

const mongoose = require('mongoose');

mongoose.set("strictQuery", false);

const db = require('./config/mongoose');

const Admintbl = require('./models/AdminModel');

const multer = require('multer');

app.use('/uploads',express.static(path.join(__dirname,'/uploads')));

app.set('view engine','ejs');
app.set('views',path.join(__dirname,"views"));

app.use(express.urlencoded());

app.get('/',(req,res)=>{
    return res.render('admin');
});

const uploads = path.join("uploads/");

const storage = multer.diskStorage({
    destination : (req,res,cb) => {
        cb(null,uploads);
    },
    filename : (req,file,cb) => {
        cb(null,file.fieldname+"-"+Date.now());
    }
});

const uploadfile = multer({ storage: storage }).single('avatar');

app.post('/insertdata',uploadfile,(req,res)=>{
    let avatar = "";
    
    if(req.file)
    {
        avatar = uploads+"/"+req.file.filename;
    }

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
        city : city,
        avatar : avatar
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

app.get('/editdata/:id',(req,res)=>{
    let editid = req.params.id;
    
    Admintbl.findById(editid,(err,editrecord)=>{
        if(err){
            console.log("Record not fetch");
            return false;
        }
        return res.render('edit',{
            editR : editrecord
        })
    })
});

app.post('/updateData',(req,res)=>{
    let id = req.body.id;
    Admintbl.findByIdAndUpdate(id,{
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        gender : req.body.gender,
        hobby : req.body.hobby,
        city : req.body.city
    },(err,data)=>{
        if(err){
            console.log("Record not update");
            return false;
        }
        console.log("Record successfully update");
        return res.redirect('/view');
    })
})

app.listen(port,(err)=>{
    if(err){
        console.log("Server not start");
        return false;
    }
    console.log("Server is start on port :- "+port);
})