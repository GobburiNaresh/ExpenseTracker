const token = localStorage.getItem('token');
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

    if (response.status === 200) {
      addNewExpenseToUI(response.data.expense);
    } else {
      throw new Error('Failed to create expense');
    }
  } catch (err) {
    console.error(err);
    document.body.innerHTML += `<div style="color:red;">${err.message}</div>`;
  }
}

function showPremiumUser(){
  const rzpButton = document.getElementById('rzp-button1');
  rzpButton.style.display = 'none';
  const addButton = document.getElementById('btn');
  addButton.style.display = 'block';
  addButton.style.width = '100%';
  document.getElementById('premium').innerHTML = "You Are A Premium User";
  
  }

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}


const decodeToken = parseJwt(token)
const ispremiumuser = decodeToken.ispremiumuser
  if(ispremiumuser === true){
    showLeaderboard();
    showPremiumUser();
      
}



window.addEventListener('DOMContentLoaded', async () => { 
  try {
  const response = await axios.get("http://localhost:3000/expense/getExpenses",{headers:{"Authorization" : token}})
  const expenses = response.data.expenses;
    expenses.forEach(expense => {
      addNewExpenseToUI(expense);
    });
  } catch (err) {
    console.log(err);
    alert(`404 error onLoad`);
  }
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


document.getElementById('rzp-button1').onclick = async function (e) {
  try {
  const response = await axios.get("http://localhost:3000/purchase/premiummembership", {headers: { "Authorization": token },})

  var options = {
    "key": response.data.key_id,
    "order_id": response.data.order.id,
    "handler": async function (response) {
      axios.post("http://localhost:3000/purchase/updatetransactionstatus",{
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          },
          { headers: { "Authorization": token } })
          alert('You are a premium User Now');
          localStorage.setItem('token', response.data.token);
          showPremiumUser();
          showLeaderboard();
    },
  };


  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();
  rzp1.on("payment.failed", function (responce) {
      console.log(responce)
      alert("something went wrong!!!")
  });
} catch (err) {
  console.error(err);
}
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
      leaderboardElem.innerHTML += `<li>Name - ${expenseDetails.name} Total Expenses - ${expenseDetails.totalExpenses ?? 0}</li>`
    })
  }
  document.getElementById("message").appendChild(inputElement);
}

function download(){
  axios.get('http://localhost:3000/user/download', { headers: {"Authorization" : token} })
  .then((response) => {
      if(response.status === 201){
          var a = document.createElement("a");
          a.href = response.data.fileUrl;
          a.download = 'myexpense.csv';
          a.click();
      } else {
          throw new Error(response.data.message)
      }
  })
  .catch((err) => {
      showError(err)
  });
}

async function pageDetails() {
  try {
    const response = await axios.get(`http://localhost:3000/expense/pageDetails?page=1&items_per_page=2`, {
      headers: { Authorization: token }
    });
    const expenses = response.data.data;
    console.log(expenses);
  } catch (err) {
    console.log(err);
    alert(`404 error onLoad`);
  }
}

function addPagination(data) {
  let pagination = document.getElementById("pagination");
  let ulTemp = document.createElement("ul");
  ulTemp.setAttribute("class", "pagination d-flex justify-content-center");

  if (data.data.info.hasPreviousPage) {
    ulTemp.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick='paginationFunc(${data.data.info.previousPage})'>Previous</a></li>`;
  }

  if (data.data.info.currentPage !== 1) {
    ulTemp.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick='paginationFunc(${1})'>1</a></li>`;
  }

  ulTemp.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick='paginationFunc(${data.data.info.currentPage})'>${data.data.info.currentPage}</a></li>`;

  if (data.data.info.hasNextPage) {
    ulTemp.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick='paginationFunc(${data.data.info.nextPage})'>Next<//a></li>`;
    ulTemp.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick='paginationFunc(${data.data.info.nextPage})'>Next</a></li>`;
  }

  if (
    data.data.info.lastPage !== data.data.info.currentPage &&
    data.data.info.nextPage !== data.data.info.lastPage
  ) {
    ulTemp.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick='paginationFunc(${data.data.info.lastPage})'>Last</a></li>`;
  }

  pagination.appendChild(ulTemp);
  localStorage.setItem("currentPage", data.data.info.currentPage);
}

function paginationFunc(pageNo) {
  let token = localStorage.getItem("token");
  let items_per_page = document.getElementById("limitM").value;
  axios
    .get(`http://localhost:3000/expense/getExpenseDetails?page=${pageNo}&items_per_page=${items_per_page}`, {
      headers: { "Authorization": token },
    })
    .then((data) => {
      expenseList.innerHTML = "";
      let temp = data.data.expenses;
      temp.forEach((ele) => {
        displayUserLog(ele);
      });
      document.getElementById("pagination").innerHTML = "";
      addPagination(data);
    })
    .catch((err) => {
      console.log(err);
    });
}

document.getElementById("limitM").addEventListener("change", (e) => {
  let pageNo = localStorage.getItem("currentPage");
  let token = localStorage.getItem("token");
  axios
    .get(
      `http://localhost:3000/expense/expenseDetails?pageNo=${pageNo}&items_per_page=${e.target.value}`,
      {
        headers: { Authorization: token },
      }
    )
    .then((data) => {
      expenseList.innerHTML = "";
      let temp = data.data.data;
      temp.forEach((ele) => {
        displayUserLog(ele);
      });
      document.getElementById("pagination").innerHTML = "";
      addPagination(data);
    })
    .catch((err) => {
      console.log(err);
    });
});
