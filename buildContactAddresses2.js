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
	if (err) {
		throw err;
	}

	console.log("Got: " + result.length + " records");

	for (var i = 0; i < result.length; i++) {
		var names = result[i].fullName.replace(/"/g, "'").split(" ");

		var sql2 = "INSERT INTO contact (firstName, lastName, title, phone1, phone2, fax, email1, notes, org) VALUES (" + 
			"\"" + names[0] + "\", \"" + names[1] + "\", \"" + result[i].title.replace(/"/g, "'") + " \", \"" + result[i].phone1 + "\", \"" + 
			result[i].phone2 + "\", " + "\"" + result[i].phone3 + "\", \"" + result[i].email + "\", \"" + result[i].notes.replace(/"/g, "'") + "\", \"" + 
			result[i].org.replace(/"/g, "'") + "\")";

		var street = result[i].street;
		var city = result[i].city;
		var state = result[i].state;
		var zip = result[i].zip;
		var country = result[i].country;

		var sql3 = "INSERT INTO address (address1, city, state, zip, country) VALUES (" + 
			"\"" + street + "\", \" " + city + "\", \"" + state + "\", \"" + zip + "\", \"" + country + "\")";

		var contactId;
		var addressId;

		connection.query(sql2, function(err, cResult) {
			if (err) throw err;

			contactId = cResult.insertId;

			console.log("Inserted ID: " + contactId);
		});

		connection.query(sql3, function(err, aResult) {
			if (err) throw err;

			addressId = aResult.insertId;
		});

		var sql4 = "UPDATE address set contactId = " + contactId + " WHERE (addressId = " + addressId + ")";

		connection.query(sql4, function(err, uRes) {
			console.log("Address updated " + addressId + " " + contactId);
		});

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