const {client} = require("../databaseConn");

async function updateUserBalance(rows) {
    for (const row of rows) {
        if (row.type === 'Deposit') {
            const query1 = `UPDATE users
                            SET balance = balance + $1
                            where username = $2`;
            await client.query(query1, [row.amount, row.transactiontouser]);
            const query2 = `UPDATE processes
                            SET status = $1
                            where id=$2`;
            await client.query(query2, ['Success', row.id]);
        } else {
            const fetchBalanceQuery = 'SELECT balance FROM users WHERE username = $1';
            const result = await client.query(fetchBalanceQuery, [row.transactionfromuser]);
            const userBalance = result.rows[0].balance;
            if (row.type === 'Withdraw') {
                if (userBalance > row.amount) {
                    const query1 = `UPDATE users
                                    SET balance = balance - $1
                                    where username = $2`;
                    await client.query(query1, [row.amount, row.transactionfromuser]);
                    const query2 = `UPDATE processes
                                    SET status = $1
                                    where id=$2`;
                    await client.query(query2, ['Success', row.id]);
                } else {
                    const query2 = `UPDATE processes
                                    SET status = $1
                                    where id=$2`
                    await client.query(query2, ['Failed', row.id]);
                }
            }
            if (row.type === 'Transfer') {
                if (userBalance > row.amount) {
                    const query1 = `UPDATE users
                                    SET balance = balance + $1
                                    where username = $2`;
                    await client.query(query1, [row.amount, row.transactiontouser]);
                    const query2 = `UPDATE users
                                    SET balance = balance - $1
                                    where username = $2`;
                    await client.query(query2, [row.amount, row.transactionfromuser]);
                    const query3 = `UPDATE processes
                                    SET status = $1
                                    where id=$2`;
                    await client.query(query3, ['Success', row.id]);
                } else {
                    const query3 = `UPDATE processes
                                    SET status = $1
                                    where id=$2`;
                    await client.query(query3, ['Failed', row.id]);
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