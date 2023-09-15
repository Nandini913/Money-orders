const { Pool } = require('pg');

// Create a PostgreSQL client
const client = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'money-orders',
    password: 'postgres',
    port: 5432, // The default PostgreSQL port
});

function processing(rows){
    rows.forEach( (row) => {
        if(row.type === 'Deposit'){
            const query = `
                UPDATE users SET balance = balance + $1 where username = $2;
                UPDATE transaction SET status = $3 where touser = $2;      
                `;
            client.query(query,[row.amount,row.touser,'Success']);
        }else if(row.type === 'Withdraw'){
            const query = `
                UPDATE users SET balance = balance - $1 where username = $2;
                UPDATE transaction SET status = $3 where fromuser = $2;      
                `;
            client.query(query,[row.amount,row.fromuser,'Success']);
        }else if(row.type === 'Transfer'){
            const query = `
                UPDATE users SET balance = balance + $1 where username = $2;
                UPDATE users SET balance = balance - $1 where username = $3;
                UPDATE transaction SET status = $4 where fromuser = $2 AND touser = $3;      
                `;
            client.query(query,[row.amount,row.touser,row.fromuser,'Success']);
            console.log(row);
        }
    })
}

// Function to fetch rows and store them in a variable
async function fetchRowsAndStoreInVariable() {
    try {
        // Connect to the PostgreSQL database
        await client.connect();

        // Your SQL query to fetch rows
        const query = 'SELECT * FROM transaction where status = ($1) LIMIT ($2)';

        // Execute the query and store the result in a variable
        const result = await client.query(query,['Pending',10]);

        // Store the rows in a variable
        const rows = result.rows;
        // Do something with the rows (e.g., print them)

        processing(rows);

    } catch (error) {
        console.error('Error fetching rows:', error);
    } finally {
        await client.end();
    }
}

module.exports = {fetchRowsAndStoreInVariable,}
