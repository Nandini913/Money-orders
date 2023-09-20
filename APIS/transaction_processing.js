const {client} = require("../databaseConn");

async function updateUserBalance(rows) {
    for (const row of rows) {
        const depositQuery = `UPDATE users SET balance = balance + $1 where username = $2`
        const withdrawQuery = `UPDATE users SET balance = balance - $1 where username = $2`
        const updateProcessStatus = `UPDATE processes SET status = $1 where id=$2`;

        if (row.type === 'Deposit') {
            await client.query(depositQuery, [row.amount, row.transactiontouser]);
            await client.query(updateProcessStatus, ['Success', row.id]);
        } else {
            const fetchBalanceQuery = 'SELECT balance FROM users WHERE username = $1';
            const result = await client.query(fetchBalanceQuery, [row.transactionfromuser]);
            const userBalance = result.rows[0].balance;

            if (row.type === 'Withdraw') {
                if (userBalance >= row.amount) {
                    await client.query(withdrawQuery, [row.amount, row.transactionfromuser]);
                    await client.query(updateProcessStatus, ['Success', row.id]);
                } else {
                    await client.query(updateProcessStatus, ['Failed', row.id]);
                }
            }
            if (row.type === 'Transfer') {
                if (userBalance >= row.amount) {
                    await client.query(depositQuery, [row.amount, row.transactiontouser]);
                    await client.query(withdrawQuery, [row.amount, row.transactionfromuser]);
                    await client.query(updateProcessStatus, ['Success', row.id]);
                } else {
                    await client.query(updateProcessStatus, ['Failed', row.id]);
                }
            }
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