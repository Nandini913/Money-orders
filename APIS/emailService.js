const nodemailer = require('nodemailer');
const {Pool} = require('pg');
const {client} = require ("../databaseConn");
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'money-orders',
    password: 'postgres',
    port: 5432, // The default PostgreSQL port
    multipleStatements: true
});
const transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 1025,
    secure: false,
});
function getTableData(tableData) {
    const headers = ['type','fromuser','touser','amount'];
    const tableHeaders = headers.map(header => `<th>${header}</th>`).join('');
    const tableRows = tableData.map(row => {
            return `<tr>${headers.map (header => `<td>${row[header] || ""}</td>`).join ('')
            }</tr>`
        }
    ).join('');
    return `
        <table border="1">
          <thead>
            <tr>${tableHeaders}</tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
    `;
}
function generateTable(transaction) {
    const table = getTableData(transaction);
    return `
        <!DOCTYPE html>
            <html lang="en">
              <head>
              </head>
              <body>
                <h1>Transaction List</h1>
                ${table}
              </body>
            </html>
    `;
}

async function serveEmails(numberofTransactions ,receiver){
    try{
        const result = await pool.query(`SELECT username , email from users WHERE email = $1 `, [receiver])
        const username = result.rows[0].username
        const toEmail = result.rows[0].email;
        const fromEmail = "admin@gmail.com"
        const query = 'SELECT * FROM transaction where fromuser = ($1) OR touser = ($1) LIMIT $2'
        const transactions  = (await client.query(query,[username,numberofTransactions]));
        const allTransactions = generateTable(transactions.rows);
        return await transporter.sendMail({
            from: fromEmail,
            to: toEmail,
            subject: "Transactions List",
            html: allTransactions
        })
    }
    catch (e){
        return e;
    }
}

async function emailProcessing() {
    const batchSize = 5;
    const emailQuery = `Select * from email where status = 'Pending' limit $1`
    const emailsReceived = await pool.query (emailQuery, [batchSize]);


    //process the emails received
    for(const email of emailsReceived.rows){
       const emailProcessed = await serveEmails(email.numberoftransactions , email.touser);
       let emailStatus = "Processed";
       if(!emailProcessed){
           emailStatus = "failed"
       }

       await pool.query('Update email set status = $1 where id = $2',[emailStatus,email.id]);
    }
}

module.exports = {emailProcessing}

