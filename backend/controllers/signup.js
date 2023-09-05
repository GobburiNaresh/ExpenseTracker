const User = require('../models/signup');
const bcrypt = require('bcrypt');

function isStringValid(string){
  if(string == undefined || string.length === 0){
      return true
  }else{
    return false
  }
}

const signup = async (req,res,next) =>{
  try{
  const {name,email,password } = req.body;
  // if(name == undefined || name.length === 0 || email == null || email.length === 0 || password == null || password.length === 0){
    if(isStringValid(name) || isStringValid(email) || isStringValid(password)){
      return res.status(400).json({err: "Bad parameters--something is missing"})
  }
  
  const saltrounds = 10;
  bcrypt.hash(password, saltrounds ,async(err,hash) =>{
    console.log(err);
    await User.create({name,email,password: hash})
    res.status(201).json({message:`Successfully create new user`});
  })
    
  }catch(err){
            res.status(500).json(err);
      }
}

function genereteAccessToken(id){

}

const login = async (req,res) => {
  try{
    const { email, password } = req.body;
    if(isStringValid(email) || isStringValid(password)){
      return res.status(400).json({message: 'Email id or password is missing',success:false})
    }
    console.log(password);
    const user = await User.findAll({where :{email}})
      if(user.length >0){
        bcrypt.compare(password,user[0].password,(err,result) => {
          if(err){
            throw new Error('Something went wrong')
          }
          if(result === true){
            res.status(200).json({success : true,message:"User Logged in Successfully"});
          }
          else{
          return res.status(200).json({success : false,message:"password is incorrect"})
        }
      })
      }else {
        return res.status(404).json({success:false,message:'User DOesnot exist'})
      }
  }catch(err){
      res.status(500).json({message: err,success: false})
  }
}


module.exports = {
    signup,
    login
}