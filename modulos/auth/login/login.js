const express = require('express');
const router = express.Router();
const db = require('./db');

router.get("/login", (req, res) => {
  console.log("jou");
  const queryStr = 'SELECT * FROM app_ppu_cliente';

  db.query(queryStr, (err, results, fields) => {
      if (err) throw err;
      console.log(results);
  });

});

module.exports = router;
