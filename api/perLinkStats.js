const express = require('express');
const router = express.Router();
var cfg = require('../config').pool;
require('dotenv').config();

function isNotURL(str) {
    // Regular expression to match a basic URL pattern
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9_-]+\.)+[a-zA-Z]{2,9}(:[0-9]+)?(\/[^\s]*)?$/;
  
    // Test if the string does NOT match the URL pattern
    return !urlPattern.test(str);
  }
  
router.post("/", async (req, res) => {
    const URLparam = req.body.urlValue;
    if (URLparam.indexOf("https://") === 0 && !isNotURL(URLparam)) {
        try {
            cfg.getConnection((err, connection) => {
              if (err) {
                console.log(err)
                return res.status(500).send("Server error, Please try again Later");
              }
              else {
                let sql = `SELECT main_url, expired_status, times_clicked, time_issued, blacklisted FROM shorty_URL WHERE short_url = ?`;
                connection.query(sql,[URLparam], function (err, result) {
                  connection.release();
                  if (err) {
        
                    console.log(`FAILED: ${err}`)
                    return res.status(500).send("Server error, Please try again Later");
                  }
                  else {
                     console.log("PER LINK STATS SENT SUCESSFULLY")
                     res.status(200).send(result)        
                  }
                });
              }
            })
        
          } catch (error) {
            console.error(error);
            return res.status(500).send("Internal Server error");
          }
    } else {
        console.log('INSECURE HTTP LINK OR STRING IS NOT A VALID URL DETECTED, REQUEST DECLINED')
        res.status(400).send("INSECURE HTTP LINK OR STRING IS NOT A VALID URL DETECTED, REQUEST DECLINED");
      }
  
});

module.exports = router;
