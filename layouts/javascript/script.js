const userDropdown = document.getElementsByTagName('select');
const array = Array.prototype.slice.call(userDropdown);

function removeChild() {
    const myNode = document.getElementById("email-history");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.lastChild);
    }
    fetchEmails();
}

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

function fetchTransaction() {

    const tableBody = document.querySelector('#tableData tbody');

    const myNode = document.getElementById("history");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.lastChild);
    }

    // Fetch data from your Node.js server
    fetch('http://localhost:3000/transactionHistory')
        .then((response) => {
            return response.json()
        })
        .then((data) => {

            if (data.designation === 'admin') {
                const myNode = document.getElementById('emailSection');
                while (myNode.firstChild) {
                    myNode.removeChild(myNode.lastChild);
                }

                const emailSection = document.getElementById("emailHistory")
                while (emailSection.firstChild) {
                    emailSection.removeChild(emailSection.lastChild);
                }

            } else {
                const myNode = document.getElementById('adminSection');
                while (myNode.firstChild) {
                    myNode.removeChild(myNode.lastChild);
                }

                const body = document.getElementById('dashboard');
                body.style.display = "flex";
                body.style.gap = "40px";


                const container = document.getElementById('left-dashboard');
                container.style.gap = "40px";

            }

            data.rows.forEach((row) => {
                const tr = document.createElement('tr');
                tr.className = "new-element";
                tr.innerHTML = `
                      <td>${row.type}</td>
                      <td>${row.transactionfromuser}</td>
                      <td>${row.transactiontouser}</td>
                      <td>${row.amount} </td>
                      <td>${row.status} </td>
                `;
                tableBody.appendChild(tr);
            })
        })
        .catch((error) => {
            console.error('Error fetching table data:', error);
        });
}

fetchTransaction();
setInterval(fetchTransaction,10000);
function fetchEmails() {
    const tableBody = document.querySelector('#emailTableData tbody');

    const myNode = document.getElementById("email-history");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.lastChild);
    }

    fetch('http://localhost:3000/transactionHistory/email')
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            data.rows.forEach((row) => {
                const tr = document.createElement('tr');
                tr.className = "new-element";
                tr.innerHTML = `
                      <td>${row.emailrecepient}</td>
                      <td>${row.numberoftransactions}</td>
                      <td>${row.status}</td>
                `;
                tableBody.appendChild(tr);
            })
        })
        .catch((error) => {
            console.error('Error fetching table data:', error);
        });
}

fetchEmails();
setInterval(fetchEmails,10000);
document.getElementById('sendEmail').addEventListener('click', async function (e) {
    e.preventDefault();
    removeChild();
    const limit = document.getElementById('noOfTransaction').value;
    await fetch('http://localhost:3000/send-mail', {
        method: "POST", headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({limit: limit})
    }).then((res) => {
        if (res.status === 200) {
            alert('Mail sent')
        } else {
            alert('Error!!')
        }
    })
    limit.value = '';
    fetchEmails();
});