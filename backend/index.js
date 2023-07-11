const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors')
const routes = require('./routes/Auth.route')




const port = process.env.PORT;
app.use(cors({
    origin:'http://localhost:3000',
    credentials:true
}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/',routes)

app.listen(port,()=>{
    console.log(port);
})