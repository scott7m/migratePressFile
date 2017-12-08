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

        // console.log(sql2);

        var street = result[i].street;
        var city = result[i].city;
        var state = result[i].state;
        var zip = result[i].zip;
        var country = result[i].country;

        console.log(sql2);

        const contactPromise = new Promise (
        	function (resolve,reject) {
        	connection.query(sql2, function(err, cResult) {
        		if (err) reject( err);

        		console.log("Resolving...");

        		var addressObj = {
        			street: street,
        			city: city,
        			state: state,
        			zip: zip,
        			country: country,
        			contactId: cResult.insertId
        		}

        		console.log(addressObj);
  				resolve(addressObj);
          	});
        });

        var addAddress = function() {
        	contactPromise.then(function(addressObj) {
        		var sql3 = "INSERT INTO address (contactId, address1, city, state, zip, country) VALUES (" + 
		        addressObj.contactId + ", \"" + addressObj.street + "\", \" " + addressObj.city + "\", \"" + addressObj.state + "\", \"" + addressObj.zip + "\", \"" + addressObj.country + "\")";

				console.log(sql3);

		        connection.query(sql3, function(err, aResult) {
	                if (err) throw err;

	                console.log("Address added: " + aResult.insertId);
		    	});
        	}).catch(function (err) {
		        	console.log("There was an error.");
		    });	  
        }

        addAddress();

        if (i > 3) break;
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