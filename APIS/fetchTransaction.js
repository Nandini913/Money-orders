const {Pool} = require('pg');

const pool = new Pool({
    user: 'nandini',
    host: 'localhost',
    database: 'money-orders',
    password: 'nandu@913',
    port: 5432, // The default PostgreSQL port
    multipleStatements: true
});

async function updateUserBalance(rows) {
    for (const row of rows) {
        if (row.type === 'Deposit') {
            const query1 = `UPDATE users
                            SET balance = balance + $1
                            where username = $2`;
            await pool.query(query1, [row.amount, row.touser]);
            const query2 = `UPDATE transaction
                            SET status = $1
                            where (touser = $2 AND type = $3)`;
            await pool.query(query2, ['Success', row.touser, row.type]);
        } else {
            const fetchBalanceQuery = 'SELECT balance FROM users WHERE username = $1';
            const result = await pool.query(fetchBalanceQuery, [row.fromuser]);
            const userBalance = result.rows[0].balance;
            if (row.type === 'Withdraw') {
                if (userBalance > row.amount) {
                    const query1 = `UPDATE users
                                    SET balance = balance - $1
                                    where username = $2`;
                    await pool.query(query1, [row.amount, row.fromuser]);
                    const query2 = `UPDATE transaction
                                    SET status = $1
                                    where fromuser = $2
                                      AND type = $3`;
                    await pool.query(query2, ['Success', row.fromuser, row.type]);
                } else {
                    const query2 = `UPDATE transaction
                                    SET status = $1
                                    where fromuser = $2
                                      AND type = $3`;
                    await pool.query(query2, ['Failed', row.fromuser, row.type]);
                }
            }
            if (row.type === 'Transfer') {
                if (userBalance > row.amount) {
                    const query1 = `UPDATE users
                                    SET balance = balance + $1
                                    where username = $2`;
                    await pool.query(query1, [row.amount, row.touser]);
                    const query2 = `UPDATE users
                                    SET balance = balance - $1
                                    where username = $2`;
                    await pool.query(query2, [row.amount, row.fromuser]);
                    const query3 = `UPDATE transaction
                                    SET status = $1
                                    where fromuser = $2
                                      AND touser = $3
                                      AND type = $4
                                      AND amount = $5`;
                    await pool.query(query3, ['Success', row.fromuser, row.touser, row.type, row.amount]);
                } else {
                    const query3 = `UPDATE transaction
                                    SET status = $1
                                    where fromuser = $2
                                      AND touser = $3
                                      AND type = $4
                                      AND amount = $5`;
                    await pool.query(query3, ['Failed', row.fromuser, row.touser, row.type, row.amount]);
                }
            }
        }
    }
}

// Function to fetch rows from transaction table.
async function transactionProcessing() {
    try {
        // Connect to the PostgreSQL database
        await pool.connect();

        // Your SQL query to fetch rows
        const query = 'SELECT * FROM transaction where status = $1 ORDER BY date LIMIT $2';

        // Execute the query and store the result in a variable
        const result = await pool.query(query, ['Pending', 4]);

        // Store the rows in a variable
        const rows = result.rows;
        await updateUserBalance(rows);
    } catch (error) {
        console.error('Error fetching rows:', error);
    }
}

module.exports = {transactionProcessing,}