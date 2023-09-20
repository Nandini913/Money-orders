// fetch users list
function fetchUsersList() {
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
}

fetchUsersList();

//show dashboard according to role
function showDashboard() {
    const tableBody = document.querySelector('#tableData tbody');
    // Fetch data from our Node.js server
    fetch('http://localhost:3000/transactionHistory')
        .then((response) => {
            return response.json()
        })
        .then((data) => {

            if (data.designation === 'admin') {
                const getEmailSection = document.getElementById('emailSection');
                getEmailSection.remove();

                const emailHistory = document.getElementById("emailHistory");
                emailHistory.remove();

            } else {
                const adminSection = document.getElementById('adminSection');
                adminSection.remove();

                const body = document.getElementById('dashboard');
                body.style.display = "flex";
                body.style.flexDirection = "row";
                body.style.justifyContent = "center";


                const container = document.getElementById('left-dashboard');
                container.style.gap = "40px";
            }
        })
        .catch((error) => {
            console.error('Error fetching table data:', error);
        });
}

showDashboard();

// fetch new data from database
function fetchNewData() {
    fetch('http://localhost:3000/transactionHistory/newTransaction')
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            const tableBody = document.getElementById('history');
            tableBody.innerHTML = '';
            data.rows.forEach((row) => {
                const newRow = document.createElement('tr');
                newRow.className = "new-element";
                newRow.innerHTML = `
                      <td>${row.type}</td>
                      <td>${row.transactionfromuser}</td>
                      <td>${row.transactiontouser}</td>
                      <td>${row.amount}</td>
                      <td>${row.status}</td>
                `;
                tableBody.appendChild(newRow);
            })
        })
}

fetchNewData();
setInterval(fetchNewData, 10000);

document.addEventListener('DOMContentLoaded', () => {

    const depositButton = document.getElementById('depositAmount');
    const deposituserName = document.getElementById('user');
    const depositAmount = document.getElementById('amount1');

    depositButton.addEventListener('click', (event) => {

        event.preventDefault(); // Prevent form submission

        const fromUser = '-';
        const toUser = deposituserName.value;
        const amount = depositAmount.value;
        const transactionType = "Deposit";

        // Create a JSON object with the data
        const data = {transactionType, fromUser, toUser, amount};
        console.log(data);
        fetch('http://localhost:3000/transaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (response.ok) {
                    //reset form
                    deposituserName.value = '';
                    amount.value = '';
                } else {
                    console.log('Data insertion failed.');
                }
                return response.json();
            })
            .catch((error) => {
                console.error('Error inserting data:', error);
            });
        fetchNewData();
    });

    const withdrawButton = document.getElementById("withdrawAmount");
    const withdrawUserName = document.getElementById("userForWithdraw");
    const withdrawAmount = document.getElementById("amount2");

    withdrawButton.addEventListener('click', (event) => {

        event.preventDefault(); // Prevent form submission

        const fromUser = withdrawUserName.value;
        const toUser = '-';
        const amount = withdrawAmount.value;
        const transactionType = "Withdraw";

        // Create a JSON object with the data
        const data = {transactionType, fromUser, toUser, amount};

        fetch('http://localhost:3000/transaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (response.ok) {
                    withdrawUserName.value = '';
                    withdrawAmount.value = '';
                } else {
                    console.log('Data insertion failed.');
                }
            })
            .catch((error) => {
                console.error('Error inserting data:', error);
            });
        fetchNewData();
    });

    const transferButton = document.getElementById("transferAmount");
    const transferFromUserName = document.getElementById("fromUser");
    const transferToUserName = document.getElementById("toUser");
    const transferAmount = document.getElementById("amount3");

    transferButton.addEventListener('click', (event) => {

        event.preventDefault(); // Prevent form submission

        const toUser = transferToUserName.value;
        const fromUser = transferFromUserName.value;
        const amount = transferAmount.value;
        const transactionType = "Transfer";

        // Create a JSON object with the data
        const data = {transactionType, fromUser, toUser, amount};

        fetch('http://localhost:3000/transaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (response.ok) {
                    //reset form
                    transferFromUserName.value = '';
                    transferToUserName.value = '';
                    transferAmount.value = '';
                } else {
                    console.log('Data insertion failed.');
                }
                return response.json();
            })
            .catch((error) => {
                console.error('Error inserting data:', error);
            });
        fetchNewData();
    });
});

function fetchEmails() {
    fetch('http://localhost:3000/transactionHistory/email')
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            const emailTableData = document.getElementById('email-history');
            emailTableData.innerHTML = '';
            data.rows.forEach((row) => {
                const newRow = document.createElement('tr');
                newRow.className = "new-element";
                newRow.innerHTML = `
                      <td>${row.emailrecepient}</td>
                      <td>${row.numberoftransactions}</td>
                      <td>${row.status}</td>
                `;
                emailTableData.appendChild(newRow);
            })
        })
        .catch((error) => {
            console.error('Error fetching table data:', error);
        });
}

fetchEmails();
setInterval(fetchEmails, 3000);

document.getElementById('sendEmail').addEventListener('click', async function (e) {
    e.preventDefault();
    const limitValue = document.getElementById('noOfTransaction');
    await fetch('http://localhost:3000/' + 'send-mail/?limit=' + limitValue.value, {
        method: "POST", headers: {
            "Content-Type": "application/json"
        },
    }).then((res) => {
        if (res.status === 200) {
            alert('Mail sent')
        } else {
            alert('Error!!')
        }
    })
    limitValue.value = '';
    fetchEmails();
});