function removeChild(){
    const myNode = document.getElementById("history");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.lastChild);
    }
}

document.addEventListener('DOMContentLoaded', () => {

    const depositButton = document.getElementById('depositAmount');
    const userName = document.getElementById('user');
    const depositAmount = document.getElementById('amount1');

    depositButton.addEventListener('click', (event) => {

        event.preventDefault(); // Prevent form submission

        removeChild();

        const fromUser = '-';
        const toUser = userName.value;
        const amount = depositAmount.value;
        const transactionType = "Deposit";

        // Create a JSON object with the data
        const data = {transactionType,fromUser,toUser,amount};
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


        const fromUser = withdrawUserName.value;
        const toUser = '-';
        const amount = withdrawAmount.value;
        const transactionType = "Withdraw";

        // Create a JSON object with the data
        const data = {transactionType,fromUser,toUser,amount};


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
                    withdrawUserName.value = '';
                    withdrawAmount.value = '';
                } else {
                    console.log('Data insertion failed.');
                }
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
        const amount = transferAmount.value;
        const transactionType = "Transfer";

        // Create a JSON object with the data
        const data = {transactionType,fromUser,toUser,amount};

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
