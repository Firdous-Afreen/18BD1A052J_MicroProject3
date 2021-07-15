const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const MongoClient=require('mongodb').MongoClient

var db;
var s;

MongoClient.connect('mongodb://localhost:27017/FahionFeet',(err, database)=>{
    if(err) return console.log(err)
    db=database.db('FashionFeet')
    app.listen(5000, ()=>{
        console.log('Listening at port number 5000')
    })
})

app.set('view-engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('public'))

//HomePage
app.get('/', (req,res)=>{
    db.collection('ladies').find().toArray((err, result)=>{
        if(err) return console.log(err)
        res.render('homepage.ejs', {data:result})
    })
})

app.get('/add', (req,res)=>{
    res.render('add.ejs')
})

app.get('/update', (req,res)=>{
    res.render('update.ejs')
})

app.get('/delete', (req,res)=>{
    res.render('delete.ejs')
})

app.post('/add', (req,res)=>{
    db.collection('ladies').save(req.body, (err,result)=>{
        if(err) return console.log(err)
    res.redirect('/')
    })
})

app.post('/update', (req,res)=>{
    db.collection('ladies').find().toArray((err,result)=>{
        if(err) return console.log(err)
        for(var i=0;i<result.length;i++){
            if(result[i].pid==req.body.pid){
                s=result[i].stock
                break
            }
        }
        db.collection('ladies').findOneAndUpdate({pid: req.body.pid}, {
            $set: {stock:parseInt(s)+parseInt(req.body.stock)}}, {sort: {_id:-1}},
            (err,result)=>{
                if(err) return res.send(err)
                console.log(req.body.pid+' stock updated')
                res.redirect('/')
        })
    })
})

app.post('/delete', (req,res)=>{
    db.collection('ladies').findOneAndDelete({pid: req.body.pid},(err,result)=>{
        if(err) return console.log(err)
        console.log(req.body.pid+' product deleted')
        res.redirect('/')
        })
    })