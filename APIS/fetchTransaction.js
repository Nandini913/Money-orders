const {client} = require("../databaseConn");

async function updateUserBalance(rows) {
    const withdrawQuery = `UPDATE users SET balance = balance - $1 where username = $2`;
    const depositQuery = `UPDATE users SET balance = balance + $1 where username = $2`;
    let isTransactionProcessed = false;
    let updateStatus ="";
    for (const row of rows) {
        {   //Transaction Processing Block
            if (row.type === 'Deposit') {
                await client.query (depositQuery, [row.amount, row.transactiontouser]);
                isTransactionProcessed = true;
            } else {
                const fetchBalanceQuery = 'SELECT balance FROM users WHERE username = $1';
                const result = await client.query (fetchBalanceQuery, [row.transactionfromuser]);
                const userBalance = result.rows[0].balance;
                if (row.type === 'Withdraw') {
                    if (userBalance > row.amount) {
                        await client.query (withdrawQuery, [row.amount, row.transactionfromuser]);
                        isTransactionProcessed = true;
                    } else {
                        isTransactionProcessed = false;
                    }
                }
                if (row.type === 'Transfer') {
                    if (userBalance > row.amount) {
                        await client.query (depositQuery, [row.amount, row.transactiontouser]);
                        await client.query (withdrawQuery, [row.amount, row.transactionfromuser]);
                        isTransactionProcessed = true;
                    } else {
                        isTransactionProcessed = false;
                    }
                }
            }
            if(isTransactionProcessed){
                updateStatus = `Update processes Set status = 'Processed' where id=$1`
            }
            else{
                updateStatus = `Update processes Set status = 'Failed' where id=$1`
            }
            await client.query(updateStatus,[row.id]);
        }
    }
}
async function transactionProcessing() {
    try {
        const query = `SELECT * FROM processes where status = $1 and type !='Email' ORDER BY date limit $2`;
        const result = await client.query(query, ['Pending',2]);
        const rows = result.rows;
        await updateUserBalance(rows);
    } catch (error) {
        console.error('Error fetching rows:', error);
    }
}
module.exports = {
    transactionProcessing,
};