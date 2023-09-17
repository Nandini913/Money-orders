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

function fetchTransaction() {

    const tableBody = document.querySelector('#tableData tbody');
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
                      <td>${row.fromuser}</td>
                      <td>${row.touser}</td>
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

function fetchEmails(){
    const tableBody = document.querySelector('#emailTableData tbody');
    fetch('http://localhost:3000/transactionHistory/email')
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            data.rows.forEach((row) => {
                const tr = document.createElement('tr');
                tr.className = "new-element";
                tr.innerHTML = `
                      <td>${row.touser}</td>
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
document.getElementById('sendEmail').addEventListener('click', async function (e) {
    e.preventDefault();
    const limit = document.getElementById('noOfTransaction').value;
    await fetch('http://localhost:3000/' + 'send-mail/', {
        method: "POST", headers: {
            "Content-Type": "application/json"
        },
        body : JSON.stringify({limit : limit})
    }).then((res) => {
        if (res.status === 200) {
            alert('Mail sent')
        } else {
            alert('Error!!')
        }
    })
    limit.value = ""
});