var mysql = require('mysql');

var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "udnamtac",
	database: "pressfile"
});

var sql = "SELECT * FROM Contact"

connection.query(sql, function(err, result, fields)  {
    if (err) throw err;

    for (var i = 0; i < result.length; i++) {
        var contactId = result[i].contactId;
        var orgName = result[i].org;

        var sql2 = "SELECT * FROM address WHERE (contactId=" + result[i].contactId + ")";

        var sql3 = "SELECT * FROM organization WHERE (name = \"" + orgName + ")";

		// console.log(sql3);

        const addressPromise = new Promise((resolve,reject) =>{
           connection.query(sql2, function(err, cResult) {
              if (err) {
              	console.log
              	return reject( err);
              }
              resolve( cResult[0].address1 );
          });
        })
       
        const addressPromise = new Promise((resolve,reject) =>{
            connection.query(sql3, function(err, aResult) {
                if (err) {
                	console.log("Error in SQL: " + sql3);
                	return reject( err);
                }
                resolve(aResult.insertId);
            });
        })

        Promise.all([contactPromise,addressPromise])
        .then(([contactId,addressId]) =>{
           var sql4 = "UPDATE address set contactId = " + contactId + " WHERE (addressId = " + addressId + ")";

          connection.query(sql4, function(err, uRes) {
              // console.log("Address updated " + addressId + " " + contactId);
          });
        
        })
        .catch(function(err) {
        	console.log("ERROR! " + err);
        });



        // if (i > 3) break;
    }
});
