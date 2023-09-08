const Razorpay = require('razorpay');
const Order =  require('../models/orders');


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
      const { payment_id,order_id } = req.body;
      const order = await Order.findOne({ where: { id : order_id } });
      console.log(order_id);
      console.log(order)

      if (!order) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      if (payment_id) {
        // Transaction is successful
        const updatedOrder = await order.update({ paymentid: payment_id, status: 'SUCCESSFUL' });
        await req.user.update({ ispremiumuser: true });
        return res.status(202).json({ success: true, message: 'Transaction Successful', order: updatedOrder });
        // Promise.all([promise1, promise2])
        //   .then(() => {
        //     return res.status(202).json({ success: true, message: 'Transaction Successful' });
        //   })
        //   .catch((error) => {
        //     throw new Error(error);
        //   });
      } else {
        // Transaction failed, update status to 'FAILED'
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



