var mysql = require('mysql');

var connection = mysql.createPool({
	host: "localhost",
	user: "root",
	password: "udnamtac",
	database: "pressfile"
});


// connection.connect(function(err) {
// 	if (err) throw err;
// 	console.log("Connected to MySQL localhost");
// });

var sql = "SELECT * FROM pfPeople";
connection.query(sql, function(err, result, fields)  {
    if (err) throw err;

    for (var i = 0; i < result.length; i++) {
        var names = result[i].fullName.replace(/"/g, "'").split(" ");

        var sql2 = "INSERT INTO contact (firstName, lastName, title, phone1, phone2, fax, email1, notes, org) VALUES (" + 
        "\"" + names[0] + "\", \"" + names[1] + "\", \"" + result[i].title.replace(/"/g, "'") + " \", \"" + result[i].phone1 + "\", \"" + 
        result[i].phone2 + "\", " + "\"" + result[i].phone3 + "\", \"" + result[i].email + "\", \"" + result[i].notes.replace(/"/g, "'") + "\", \"" + 
        result[i].org.replace(/"/g, "'") + "\")";

        var street = result[i].street == null ? "" : result[i].street.replace(/"/g, "'").replace("\\", "");
        var city = result[i].city;
        var state = result[i].state;
        var zip = result[i].zip;
        var country = result[i].country;
        var residential = (result[i].residential == null || result[i].residential == "" ? 0 : result[i].residential);

        var sql3 = "INSERT INTO address (address1, city, state, zip, country, residential) VALUES (" + 
        "\"" + street + "\", \" " + city + "\", \"" + state + "\", \"" + zip + "\", \"" + country + "\", " + residential + ")";

		// console.log(sql3);

        const contactPromise = new Promise((resolve,reject) =>{
           connection.query(sql2, function(err, cResult) {
              if (err) {
              	console.log
              	return reject( err);
              }
              resolve( cResult.insertId);
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


// function writeAddress(contactId, street, city, state, zip, country) {
// 	sql3 = "INSERT INTO address (contactId, address1, city, state, zip, country) VALUES (" + 
// 	contactId + ", \"" + street + "\", \" " + city + "\", \"" + state + "\", \"" + zip + "\", \"" + country + "\")";

// 	// console.log("Query 3: " + sql3);


// 	connection.query(sql3, function(err, aResult) {
// 		if (err) throw err;

// 		console.log("Address added " + aResult.insertId);
// 	});
// }

// connection.end();