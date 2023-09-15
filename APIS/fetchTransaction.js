const {Pool} = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'money-orders',
    password: 'postgres',
    port: 5432, // The default PostgreSQL port
    multipleStatements: true
});

async function updateUserBalance(rows) {
    for (const row of rows) {
        const fetchBalanceQuery = 'SELECT balance from users where username = $1';
        const userBalance = await pool.query(fetchBalanceQuery, [row.fromuser]);

        if (row.type === 'Deposit') {
            const query1 = `UPDATE users
                            SET balance = balance + $1
                            where username = $2;`;
            await pool.query(query1, [row.amount, row.touser]);
            const query2 = `UPDATE transaction
                            SET status = $1
                            where touser = $2`;
            await pool.query(query2, ['Success', row.touser]);
        } else if (row.type === 'Withdraw') {
            if (userBalance > row.amount) {
                const query1 = `UPDATE users
                                SET balance = balance - $1
                                where username = $2`;
                await pool.query(query1, [row.amount, row.fromuser]);
                const query2 = `UPDATE transaction
                                SET status = $1
                                where fromuser = $2`;
                await pool.query(query2, ['Success', row.fromuser]);
            } else {
                const query2 = `UPDATE transaction
                                SET status = $1
                                where fromuser = $2`;
                await pool.query(query2, ['Failed', row.fromuser]);
            }
        } else if (row.type === 'Transfer') {
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
                                  AND touser = $3`;
                await pool.query(query3, ['Success', row.fromuser, row.touser]);
            } else {
                const query3 = `UPDATE transaction
                                SET status = $1
                                where fromuser = $2
                                  AND touser = $3`;
                await pool.query(query3, ['Failed', row.fromuser, row.touser]);
            }
        }
    }
}

// Function to fetch rows from transaction table.
async function fetchRows() {
    try {
        // Connect to the PostgreSQL database
        await pool.connect();

        // Your SQL query to fetch rows
        const query = 'SELECT * FROM transaction where status = $1 LIMIT $2';

        // Execute the query and store the result in a variable
        const result = await pool.query(query, ['Pending', 2]);

        // Store the rows in a variable
        const rows = result.rows;

        await updateUserBalance(rows);

    } catch (error) {
        console.error('Error fetching rows:', error);
    } finally {
        await pool.end();
    }
}

module.exports = {fetchRows,}