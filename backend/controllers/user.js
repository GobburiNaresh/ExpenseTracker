const User = require('../models/user');

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
  
    await User.create({name,email,password})
    res.status(201).json({message:`Successfully create new user`});
    }catch(err){
            res.status(500).json(err);
        }
}


// const getOrder = async (req,res,next) => {
//     try{
//       const orders = await Order.findAll();
//       res.status(200).json({allOrders : orders});
//     }
//     catch(err){
//       console.log('GET products is failing', JSON.stringify(err))
//       res.status(500).json({
//       error: err
//     })
  
//   }
    
// }

// const deleteOrder = async (req, res, next) => {
  
//   try{
//     const orderId = req.params.id;
//     if(!orderId){
//       console.log("ID is missing")
//       return res.status(400).json({err : 'ID is missing'});

//     }
//     await Order.destroy({where: {id: orderId}});
//     res.status(200);

//   } 
//   catch (error) {
//     console.log(error);
//     res.status(500).json({ error: 'An error occurred' });
//   }
// };

module.exports = {
    signup,
    // getOrder,
    // deleteOrder,
}