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
        addNewExpenseToUI(response.data.amount);
      } else {
        throw new Error('Failed to create expense');
      }
    } catch (err) {
      console.error(err);
      document.body.innerHTML += `<div style="color:red;">${err.message}</div>`;
    }
  }

  function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function showPremiumUser(){
  const rzpButton = document.getElementById('rzp-button1');
  rzpButton.style.display = 'none';
  const addButton = document.getElementById('btn');
  addButton.style.display = 'block';
  addButton.style.width = '100%';
  document.getElementById('premium').innerHTML = "You Are A Premium User";

}

 window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const decodeToken = parseJwt(token)
    const ispremiumuser = decodeToken.ispremiumuser
    if(ispremiumuser){
      showLeaderboard();
      showPremiumUser();
        
    }
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

  function showLeaderboard(){
    const inputElement = document.createElement("input")
    inputElement.type ="button";
    inputElement.value = "Show LeaderBoard";
    inputElement.onclick = async()=>{
      const token = localStorage.getItem('token')
      const userLeaderBoardArray = await axios.get('http://localhost:3000/premium/showleaderboard', { headers: { "Authorization": token } })
      console.log(userLeaderBoardArray);
  
      var leaderboardElem = document.getElementById('leaderboard');
      leaderboardElem.innerHTML += '<h1> Leader board </h1>'
      userLeaderBoardArray.data.forEach((expenseDetails) => {
        leaderboardElem.innerHTML += `<li>Name - ${expenseDetails.name} Total Expenses - ${expenseDetails.totalExpenses}</li>`
      })
    }
    document.getElementById("message").appendChild(inputElement);
  }


 const rzpOptions = {
    key: 'rzp_test_TRAYlUdumQMPxK',
    order_id: '',
    handler:  function (response) {
      if (response.razorpay_payment_id) {

        const token = localStorage.getItem('token');
        axios.post("http://localhost:3000/purchase/updatetransactionstatus",{
              order_id: rzpOptions.order_id,
              payment_id: response.razorpay_payment_id,
            },
            { headers: { "Authorization": token } }
          )
          .then((response) => {
            alert('You are a premium User Now');
            //const tokenData = JSON.stringify(response.data.token);
            localStorage.setItem('token', response.data.token);
            showPremiumUser();
            showLeaderboard();
          })
          .catch((error) => {
            console.error(error);
            alert('Failed to update transaction status');
          });
      } 
      
      else {
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
    
       rzpOptions.key_id = response.data.key_id;
       rzpOptions.order_id = response.data.orderDetailid.id;
 
      
       rzp1.open();
     })
     .catch((error) => {
       console.error(error);
       alert('Failed to initiate payment');
     });
 
   return false;
 };
 
  
  
