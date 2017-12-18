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
				if (err) {
					console.log(err);
					return reject (err);
				}

				resolve (result);
			});
		});
	}

	close() {
		return new Promise((resolve, reject) => {
			this.connection.end(err => {
				if (err) {
					console.log(err);
					return reject (err);
				}

				resolve();
			});
		});
	}
}



var database = new Database();

database.query("SELECT * FROM review_list")
	.then( result => {
		for (var i = 0; i < result.length; i++) {
			// console.log(result);

			var contacts = result[i].pfContacts == null ? [] : result[i].pfContacts.split("");
			var listId = result[i].listId;

			for (var j = 0; j < contacts.length; j++) {
				// console.log("Serial " + contacts[j]);
				if (contacts[j] == null || contacts[j] == "") {
					continue;
				}

				var sql2 = "SELECT *, " + listId + " AS listId2 FROM contact WHERE (pfSerial = \"" + contacts[j] + "\")";
				// console.log(sql2);

				database.query(sql2)
				.then(result2 => {

					if (result2[0] == undefined || result2[0] == null) {
						// console.log("Result2 undefined!");
						return result2;
					} else {
						// console.log(result2[0]);

						var listId2 = result2[0].listId2;
						// console.log("List ID 2: " + listId2);
						var contactId = result2[0].contactId;

						var sql3 = "INSERT INTO contact_list (contactId, listId) VALUES (" + contactId + ", " + listId2 + ")";
						console.log(sql3);

						return database.query(sql3);
					}
				}).then( result3 => {
					console.log(result3);
				});
			}
		}
	}).catch((err) => {
		console.log(err);
		databse.close();
	});

process.on('unhandledRejection', (reason, p) => {
	console.log('Unhandled Rejection at: Promise', p);
});
