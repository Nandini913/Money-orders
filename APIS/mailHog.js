const {client} = require("../databaseConn");
const nodemailer = require('nodemailer');
const express = require('express')
const router = express.Router();
router.use (express.static ("./layouts"))
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
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
    const tableHTML = getTableData(transaction);
    return `
        <!DOCTYPE html>
            <html lang="en">
              <head>
              </head>
              <body>
                <h1>Transaction List</h1>
                ${tableHTML}
              </body>
            </html>
    `;
}
router.get('/' ,async (req,res) => {
    const username = req.user.username;
    const { limit } = req.body;
    const result = await client.query(`SELECT user_id , email from users WHERE username = $1`, [username]);
    const to_email = result.rows[0].email;
    const query = 'SELECT * FROM transaction where fromuser = ($1) OR touser = ($1) LIMIT $2'
    const transactions  = (await client.query(query,[username,limit]));
    const allTransactions = generateTable(transactions.rows);
    const obj = await transporter.sendMail({
        from: "nandini@gmail.com",
        to: to_email,
        subject: "Requested Transactions List",
        html: allTransactions
    }).then(res => {
        console.log(res);
    });
    res.send({status: 200});
});
module.exports = router;