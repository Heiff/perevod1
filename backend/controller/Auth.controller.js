const pg = require('../db/pg');
const { passHash, passCompare } = require('../utils/bcypt');
const jwt = require('../utils/jwt')
const Register = async(req,res)=>{
try {
    const { username,password } = req.body;
    console.log(req.body);

    const findUser = await pg("select * from auth where username = $1",username);

    if (findUser.length) {
        return res.status(403).json({message:'username bor'})
    }
    const hashPass = await passHash(password);
    const newUser = (await pg("insert into auth(username,password)values($1,$2) returning *",username,hashPass))[0];
    res.status(201).json({message:"succes register" ,data:newUser})
} catch (error) {
    res.status(400).json({message:error})
}
}

const Login = async(req,res) => {
try {
    const { username,password } = req.body;
    console.log(username);
    const findUser = (await pg("select * from auth where username = $1",username))[0];
    const card = (await pg("select * from card where card_id = $1",findUser.id))[0]
    console.log(findUser,card);
    if (card) {
        res.cookie('card',card.cardnum)
        const token = await jwt.sign(username);
        res.cookie('token',token)
    }
    if (!findUser) { 
        return res.status(403).json({message:'not user'})
    }
    const compare = await passCompare(password,findUser.password)
    if(!compare){
        return res.status(403).json({message:'Incorrent password or username'})
    }
    const token = await jwt.sign(username);
    res.cookie('token',token)
    res.status(200).json({message:'succes'})
} catch (error) {
    res.status(400).json({message:error})
}
}

module.exports = {
    Register,
    Login
}