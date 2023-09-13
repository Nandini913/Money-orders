function removeChild(){
    const myNode = document.getElementById("history");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.lastChild);
    }
}

document.addEventListener('DOMContentLoaded', () => {

    const depositButton = document.getElementById('depositAmount');

    const userName = document.getElementById('user');
    const amount = document.getElementById('amount1');

    depositButton.addEventListener('click', (event) => {

        event.preventDefault(); // Prevent form submission

        removeChild();

        const user = userName.value;
        const amt = amount.value;
        const type = "Deposit";

        // Create a JSON object with the data
        const data = {user, amt, type};

        fetch('http://localhost:3000/deposit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (response.ok) {
                    //reset form
                    userName.value = '';
                    amount.value = '';
                } else {
                    console.log('Data insertion failed.');
                }
                return response.json();
            })

            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.error('Error inserting data:', error);
            });
        fetchTransaction();
    });

    const withdrawButton = document.getElementById("withdrawAmount");
    const withdrawUserName = document.getElementById("userForWithdraw");
    const withdrawAmount = document.getElementById("amount2");

    withdrawButton.addEventListener('click', (event) => {

        event.preventDefault(); // Prevent form submission

        removeChild();

        const user = withdrawUserName.value;
        const amt = withdrawAmount.value;
        const type = "Withdraw";

        // Create a JSON object with the data
        const data = {user, amt, type};

        fetch('http://localhost:3000/withdraw', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                console.log(data);
                if (response.ok) {
                    //reset form
                    withdrawUserName.value = '';
                    withdrawAmount.value = '';
                } else {
                    console.log('Data insertion failed.');
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.error('Error inserting data:', error);
            });
        fetchTransaction();
    });

    const transferButton = document.getElementById("transferAmount");
    const transferFromUserName = document.getElementById("fromUser");
    const transferToUserName = document.getElementById("toUser");
    const transferAmount = document.getElementById("amount3");

    transferButton.addEventListener('click', (event) => {

        event.preventDefault(); // Prevent form submission

        removeChild();

        const toUser = transferToUserName.value;
        const fromUser = transferFromUserName.value;
        const amt = transferAmount.value;
        const type = "Transfer";

        // Create a JSON object with the data
        const data = {toUser, fromUser, amt, type};

        fetch('http://localhost:3000/transfer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                console.log(data);
                if (response.ok) {
                    //reset form
                    withdrawUserName.value = '';
                    withdrawAmount.value = '';
                } else {
                    console.log('Data insertion failed.');
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.error('Error inserting data:', error);
            });
        fetchTransaction();
    });
});
