const userDropdown = document.getElementsByTagName('select');
const array = Array.prototype.slice.call(userDropdown);
fetch('http://localhost:3000/users')
    .then(response => response.json())
    .then(usernames => {
        array.forEach((list) => {
            usernames.forEach(username => {
                const option = document.createElement('option');
                option.value = username;
                option.textContent = username;
                list.appendChild(option);
            });
        })
    })
    .catch(error => {
        console.error('Error fetching usernames:', error);
    });


// transaction History

const tableBody = document.querySelector('#tableData tbody');

// Fetch data from your Node.js server
fetch('http://localhost:3000/transactionHistory')
    .then((response) => response.json())
    .then((data) => {
        data.forEach((row) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
          <td>${row.type}</td>
          <td>${row.fromuser}</td>
          <td>${row.touser}</td>
          <td>${row.amount} </td>
        `;
            tableBody.appendChild(tr);
        });
    })
    .catch((error) => {
        console.error('Error fetching table data:', error);
    });


function setDeposit() {
    const form = document.getElementById('depositForm');
    form.setAttribute("name","deposit")
    console.log("set deposit");
}

function setWithdraw(){

}

function setTransfer(){

}
