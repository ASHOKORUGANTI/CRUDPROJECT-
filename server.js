const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const MongoClient=require('mongodb').MongoClient

var db;
var s;

MongoClient.connect('mongodb://localhost:27017/dcars',(err, database)=>{
    if(err) return console.log(err)
    db=database.db('dcars')
    app.listen(4000, ()=>{
        console.log('Listening to port number 4000')
    })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req,res)=>{
    db.collection('ccars').find().toArray( (err,result)=>{
        if(err) return console.log(err)
    res.render('homepage.ejs', {data: result})
    })
})

app.get('/create', (req,res)=>{
    res.render('add.ejs')
})

app.get('/updatestock', (req,res)=>{
    res.render('update.ejs')
})

app.get('/removestock', (req,res)=>{
    res.render('remove.ejs')
})

app.get('/deleteproduct', (req,res)=>{
    res.render('delete.ejs')
})

app.post('/AddData', (req,res)=>{
    db.collection('ccars').save(req.body, (err, result)=>{
        if(err) return console.log(err)
    res.redirect('/')
})
})

app.post('/update', (req, res)=>{

    db.collection('ccars').find().toArray((err, result)=>{
        if(err)
            return console.log(err)
        for(var i=0;i<result.length;i++)
        {
            if(result[i].cid==req.body.id)
            {
                s=result[i].stock
                break
            }
        }
        db.collection('ccars').findOneAndUpdate({cid: req.body.id}, {
            $set: {stock: parseInt(s) + parseInt(req.body.stock)}}, {sort: {_id: -1}},
            (err, result)=>{
            if(err)
                return res.send(err)
            //console.log(req.body.id+' stock updated')
            res.redirect('/')
        })
})
})

app.post('/remove', (req, res)=>{

    db.collection('ccars').find().toArray((err, result)=>{
        if(err)
            return console.log(err)
        for(var i=0;i<result.length;i++)
        {
            if(result[i].cid==req.body.id)
            {
                s=result[i].stock
                break
            }
        }
        db.collection('ccars').findOneAndUpdate({cid: req.body.id}, {
            $set: {stock: parseInt(s) - parseInt(req.body.stock)}}, {sort: {_id: -1}},
            (err, result)=>{
            if(err)
                return res.send(err)
            //console.log(req.body.id+' stock updated')
            res.redirect('/')
        })
})
})

app.post('/delete', (req,res)=>{
    db.collection('ccars').findOneAndDelete({cid:req.body.id}, (err,result)=>{
        if(err)
            return console.log(err)
        res.redirect('/')
    })
})