const Razorpay = require('razorpay');
const Order =  require('../models/orders');
const userController = require('./signup');


const purchasePremium = async (req,res) => {
    try {
        var rzp = new Razorpay({
            // key_id: process.env.RAZORPAY_KEY_ID,
            // key_secret: process.env.RAZORPAY_KEY_SECRET,
            key_id: 'rzp_test_TRAYlUdumQMPxK',
            key_secret: 'WHNwrmkFOWHKH7bRV7G5PFcq'
        })
        const amount = 2500;

        rzp.orders.create({ amount : amount, currency: "INR"}, async (err,order)=>{
            if(err){
                    console.error("Razorpay Error:", err);
                    throw new Error(JSON.stringify(err));
                }
                try{
                const createdOrder = await Order.create({orderDetailid: order.id, status: 'PENDING'});
                return res.status(201).json({ orderDetailid: createdOrder, key_id : rzp.key_id});
                }catch(err){
                    throw new Error(err)
                }
            })
        }catch(err){
        console.log(err);
        res.status(403).json({message: 'Something went wrong', error:err})
    }
}

const updateTransactionStatus = async (req, res) => {
    try {
      const userId = req.user.id;
      const { payment_id,order_id } = req.body;
      const order = await Order.findOne({ where: { id : order_id } });

      if (!order) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      if (payment_id) {
        const updatedOrder = await order.update({ paymentid: payment_id, status: 'SUCCESSFUL' });
        await req.user.update({ ispremiumuser: true });
        return res.status(202).json({ success: true, message: 'Transaction Successful', order: updatedOrder , token: userController.generateAccessToken(userId,undefined,true)});
      } else {
        const promise = await order.update({ status: 'FAILED' });
  
        promise
          .then(() => {
            return res.status(202).json({ success: true, message: 'Transaction Failed' });
          })
          .catch((error) => {
            throw new Error(error);
          });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    }
  };
  


module.exports = {
    purchasePremium,
    updateTransactionStatus
}



