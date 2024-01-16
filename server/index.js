const express = require('express');
const app = express();
const mongoose = require('mongoose');
app.use("/files",express.static("files"));
const cors = require('cors');
app.use(cors());
const mongoUrl = 'mongodb+srv://pramodkumta26:cHIa6ItKY5g9qnes@cluster0.iajy4c3.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongoUrl, {
     useNewUrlParser: true,
     useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to database!');
    })
    .catch((e)=>console.log(e));

    const multer = require('multer');
    const storage = multer.diskStorage({
        destination:function (req,file,cb){
            cb(null,'./files');
        },
        filename:function(req,file,cb){
            const uniqueSuffix = Date.now() 
            cb(null,uniqueSuffix+file.originalname);
        }
    });


require('./pdfDetails');
const PdfSchema=mongoose.model('PdfDetails');

    const upload = multer({storage:storage});
    app.post('/upload-files',upload.single('file'),async(req,res)=>{
        console.log(req.file);
        const title = req.body.title;
        const fileName = req.file.filename;
        try {
            await PdfSchema.create({title:title,pdf:fileName});
            res.send({status:"ok"});
        } catch (error) {
            res.json({status:error});
        }
        
    });

    app.get('/get-files',async(req,res)=>{
        try {
            PdfSchema.find({}).then((data)=>{
                res.send({status:"ok",data:data});
            })
        } catch (error) {
            
        }
    })

    app.get("/",async(req,res)=>{
        res.send("success !!!");
    });

    app.listen(5000,()=>{
        console.log("server started");
    });