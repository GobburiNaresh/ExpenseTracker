async function ExpenseTracker(event) {
    try {
      event.preventDefault();
      const amount = event.target.amount.value;
      const description = event.target.description.value;
      const category = event.target.category.value;

      const expenseDetails = {
        amount: amount,
        description: description,
        category: category,
      }
      console.log(expenseDetails);
      const token = localStorage.getItem('token');
      const response = await axios.post("http://localhost:3000/expense/addExpense", expenseDetails,{headers:{"Authorization" : token}});

      if (response.status === 201) {
        addNewExpenseToUI(response.data.expense);
      } else {
        throw new Error('Failed to create expense');
      }
    } catch (err) {
      console.error(err);
      document.body.innerHTML += `<div style="color:red;">${err.message}</div>`;
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    axios.get("http://localhost:3000/expense/getExpenses",{headers:{"Authorization" : token}})
      .then((response) => {
        response.data.expenses.forEach((expense) => {
          addNewExpenseToUI(expense);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  });

  function addNewExpenseToUI(expenseDetails) {
    const parentElement = document.getElementById('listOfExpenses');
    const childElement = document.createElement('li');
    childElement.textContent = `${expenseDetails.amount} -- ${expenseDetails.description} -- ${expenseDetails.category}`;

    const deleteButton = document.createElement('input');
    deleteButton.type = 'button';
    deleteButton.value = 'delete';
    deleteButton.id = 'delete';
    deleteButton.onclick = () => {  
      const token = localStorage.getItem('token'); 
      axios.delete(`http://localhost:3000/expense/deleteExpense/${expenseDetails.id}`, {headers: {"Authorization" : token} })
        .then(() => {
          parentElement.removeChild(childElement);
        })
        .catch((error) => {
          console.error(error);
        });
    };
    childElement.appendChild(deleteButton);
    parentElement.appendChild(childElement);
  }


  // Move Razorpay options and rzp1 creation outside of the click event handler
 const rzpOptions = {
    key: 'rzp_test_TRAYlUdumQMPxK', // Replace with your Razorpay key
    order_id: '',
    handler: function (response) {
      if (response.razorpay_payment_id) {
        // Payment is successful
        const token = localStorage.getItem('token');
        axios.post("http://localhost:3000/purchase/updatetransactionstatus",{
              order_id: rzpOptions.order_id,
              payment_id: response.razorpay_payment_id,
            },
            { headers: { "Authorization": token } }
          )
          .then(() => {
            alert('You are a premium User Now');
          })
          .catch((error) => {
            console.error(error);
            alert('Failed to update transaction status');
          });
          console.log(rzpOptions.order_id);
      } 
      
      else {
        // Payment failed or was canceled
        alert('Payment failed or was canceled');
      }
    },
 };

 
 const rzp1 = new Razorpay(rzpOptions);
 const token = localStorage.getItem('token');
 
 document.getElementById('rzp-button1').onclick = function () {
   axios
     .get("http://localhost:3000/purchase/premiummembership", {
       headers: { "Authorization": token },
     })
     .then((response) => {
       // Debugging line
       rzpOptions.key_id = response.data.key_id;
       rzpOptions.order_id = response.data.orderDetailid.id;
 
       // Open the Razorpay payment dialog
       rzp1.open();
     })
     .catch((error) => {
       console.error(error);
       alert('Failed to initiate payment');
     });
 
   // Prevent default button behavior
   return false;
 };
 
  
  
  

//   document.getElementById('rzp-button1').onclick = async function(e){
//     const token = localStorage.getItem('token');
//     const response = await axios.get("http://localhost:3000/purchase/premiummembership",{headers: {"Authorization" : token} });
//     console.log(response);
//     var options = {
//       "key": 'rzp_test_TRAYlUdumQMPxK',
//       "order_id":response.data.orderDetailid.id,

//       "handler": async function(response){
//         await axios.post("http://localhost:3000/purchase/updatetransactionstatus",{
//           order_id: options.order_id,
//           payment_id:response.razorpay_payment_id,
//       },{headers: {"Authorization" : token} })
//       alert('You are a premium User Now');
//     },

//   };
//   const rzp1 = new Razorpay(options);
//   rzp1.open();
//   e.preventDefault();

//   rzp1.on('payment.failed', function (response){
//     console.log(response);
//     alert('someThing went wrong');
//   });      
// }

