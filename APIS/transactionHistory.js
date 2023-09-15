const express = require('express');
const router = express.Router();
const {client} = require("../databaseConn");
router.use(express.urlencoded({ extended: true }));

// function removeChild(className) {
//     const myNode=document.querySelectorAll('.'+className);
//     myNode.forEach(element=>{
//         element.remove();
//     })
// }

router.get('/',async(req,res)=>{
    try {
        const {username,designation} = req.user;
        let rows ;
        if(designation === "customer"){
            const query = 'SELECT * FROM transaction where fromuser = ($1) OR touser = ($2) ORDER BY date'
            rows  = (await client.query(query,[username,username])).rows;
            return res.status(200).json({rows, designation });
        }else {
            // await removeChild(customer-container);
            const query = 'SELECT * FROM transaction ORDER BY date'; // Replace with your table name
            rows = (await client.query(query)).rows;
            return res.status(200).json({rows,designation});
        }
    } catch (error) {
        console.error('Error fetching table data from PostgreSQL:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
