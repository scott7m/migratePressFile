var mysql = require('mysql');

class Database {
	constructor() {
		this.connection = mysql.createConnection({
			host: "localhost",
			user: "root",
			password: "udnamtac",
			database: "pressfile"
		});	
	}

	query(sql, args) {
		return new Promise((resolve, reject) => {
			this.connection.query(sql, args, (err, result, fields) => {
				if (err) return reject(err);

				resolve (result);
			});
		});
	}

	close() {
		return new Promise((resolve, reject) => {
			this.connection.end(err => {
				if (err) return reject (err);

				resolve();
			});
		});
	}
}

var contactId;
var address1;
var orgName;

var database = new Database();

database.query("SELECT * FROM contact")
	.then( result => {
		for (var i = 0; i < result.length; i++) {
			contactId = result[i].contactId;
			orgName = result[i].org;
			return database.query("SELECT * FROM address WHERE (contactId = " + contactId + ")");
		}
	}).then(result => {
		if (result.length == 1) {
			address1 = result.address1;
			return database.query("SELECT * FROM organization WHERE (name = " + orgName + ")");
		} else {
			console.log("Address Result not length 1, length: " + result.length);
		}
	}).then(result => {
		console.log(result);
	}).then( result => database.close());


// var sql = "SELECT * FROM Contact"

// console.log(sql);

// connection.query(sql, function(err, result, fields)  {
//     if (err) throw err;

//     for (var i = 0; i < result.length; i++) {

//         var contactId = result[i].contactId;
//         var orgName = result[i].org;

//         console.log("ID: " + contactId + " org: " + orgName + " name: " + result[i].firstName + " " + result[i].lastName);

//         var sql2 = "SELECT * FROM address WHERE (contactId=" + result[i].contactId + ")";

// 		var organizationId;

//         const dbPromise = new Promise((resolve, reject) => {
// 			var address1;

//         	connection.query(sql2, (err, result2, fields) => {
//         		if (err) throw err;

//         		console.log(result2);

//         		address1 = result2.address1;
//         		console.log("Got address: " + address1);

//         		resolve(address1);
//     		});
//     	}).then((address1) => {
//     		var sql3 = "SELECT * FROM organization WHERE (name = \"" + orgName + "\") AND (address1 = \"" + address1 + "\")";

//     		console.log("SQL 3: " + sql3);

//             connection.query(sql3, function(err, result3, fields) {
//             	console.log("result 3 : " + result3);

//             	if (result3) {

// 	            	organizationId = result3.organizationId;

// 	            	console.log("OrgId: " + organizationId);

// 	            	return organizationId;
// 	            } else {
// 	            	return false;
// 	            }
//             });
//         }).catch(function(err) {
//         	console.log("ERROR! " + err);
//         });

//         Promise.all([dbPromise]).then((organizationId) => {
//         	console.log("ContactID: " + contactId + " OrgId: " + organizationId);
//         });

//         if (i > 3) {
//         	break;
//         }
//     }

// 	connection.end();
// });
