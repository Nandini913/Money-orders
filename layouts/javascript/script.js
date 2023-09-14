const userDropdown = document.getElementsByTagName('select');
const array = Array.prototype.slice.call(userDropdown);

fetch('http://localhost:3000/users')
    .then(response => response.json())
    .then(usernames => {
        array.forEach((list) => {
            console.log(list);
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
    console.log("hello")
    // Fetch data from your Node.js server
    fetch('http://localhost:3000/transactionHistory')
        .then((response) => {
            console.log("hello2")
            return response.json()
        })
        .then((data) => {

            if(data.designation === 'admin'){
                const myNode = document.getElementById('emailSection');
                while (myNode.firstChild) {
                    myNode.removeChild(myNode.lastChild);
                }

            }
            else{
                const myNode = document.getElementById('adminSection');
                while (myNode.firstChild) {
                    myNode.removeChild(myNode.lastChild);
                }
                const body=document.getElementById('dashboard');
                body.style.display="block";

                const container = document.getElementById('left-dashboard');
                container.style.gap="20px";

            }

            data.rows.forEach((row) => {
                const tr = document.createElement('tr');
                tr.className = "new-element";
                tr.innerHTML = `
                      <td>${row.type}</td>
                      <td>${row.fromuser}</td>
                      <td>${row.touser}</td>
                      <td>${row.amount} </td>
                `;
                tableBody.appendChild(tr);
            }
            )
        })
        .catch((error) => {
            console.error('Error fetching table data:', error);
        });
}

fetchTransaction();
