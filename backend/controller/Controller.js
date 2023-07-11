const pg = require('../db/pg');
const jwt = require('../utils/jwt')
const addCard = async(req,res) => {
    try {
        const { card,year,balance,token } = req.body;
        const username = jwt.verify(token)
        console.log(req.body);
        const findUser = (await pg("select * from auth where username = $1",username))[0];
        console.log(findUser.id);
        (await pg("insert into card(cardnum,year,balance,card_id)values($1,$2,$3,$4) returning *",card,year,balance,findUser.id))[0];
        (await pg("insert into cashback(balance,user_id)values($1,$2) returning *",0,findUser.id))[0];
        res.cookie('card',card)
        res.status(200).json({message:'succes'})
    } catch (error) {
        res.status(400).json({message:error})
    }
}

const getStore = async(req,res) => {
    try {
        console.log(req);
        const product = await pg("select * from store")
        res.status(200).json(product)
    } catch (error) {
        res.status(404).json(error)
    }  
}

const Pay = async(req,res) =>{
    try {
        const {id,money,username} = req.body;
        if (id && money) {
            const user = await jwt.verify(username)
            const findUser = (await pg("select * from auth where username = $1",user))[0].id;
            const card = (await pg("select * from card where card_id = $1",findUser))[0];
            const cashback = money * 0.02 
            const sidebalance = money * 0.03
            const newmoney = Math.floor(money - (cashback + sidebalance))
            const newId = parseInt(id); 
           
            if (card.balance >= money) {
                await pg("update card set balance = balance - $1 where id = $2",money,findUser)
                await pg("update store set balance = balance + $1 where id = $2",newmoney,newId)
                await pg("update cashback set balance = balance + $1 where user_id = $2",cashback,findUser)
                await pg("update cash set balance = balance + $1",sidebalance)
                res.status(200).json({message:'succes'})
            }
            if (card.balance < money) {
                res.status(400).json({message:'pulingiz yetmaydi'})
            }   
        }
            else {
                res.status(403).json({message:"error front"})
            }
          
    } catch (error) {
        res.status(400).json(error)
    }
}

module.exports = {
    addCard,
    getStore,
    Pay
}