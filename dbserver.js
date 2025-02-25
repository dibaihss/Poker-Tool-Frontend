
const {Pool, Client} = require('pg');



const client = new Client({
    user: 'postgres',
    password: 'May50fdsf',
    hostname: 'ihssan',
    port: 5432 ,
    database: 'pokerappdb'
});

client.connect()
.then(() => console.log('connected successfully'))
.catch(e => console.log(e))

client.query('select * from members' , (err , result) =>{
    if(!err){
        console.log(result.rows)
        console.table(result.rows)
// var task = result.rows


    }
    client.end()
    // console.log(task)

})

const path = require('path');
const express = require('express');
const app = express();

app.get('/get' , (req, res)=>{
    res.send("hallo world")
    // res.sendFile(path.join(__dirname, 'static' , 'ggg.png'))
    
    }).listen(4500)
