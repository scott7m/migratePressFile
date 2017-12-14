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

var database = new Database();

database.query("SELECT * FROM contact")
	.then( result => {
		for (var i = 0; i < result.length; i++) {
			var contactId = result[i].contactId;
			var orgName = result[i].org;

			var sql2 = "SELECT *, " + contactId + " AS contactId FROM organization WHERE (name = \"" + orgName + "\")";
			// console.log(sql2);

			database.query(sql2)
			.then(result2 => {
				// console.log(result2);

				var orgId = result2[0].organizationId;
				var contactId = result2[0].contactId;

				var sql3 = "INSERT INTO contact_organization (contactId, organizationId) VALUES (" + contactId + ", " + orgId + ")";
				console.log(sql3);

				return database.query(sql3);
			}).then( result3 => {
				console.log(result3);
			});
		}
	}).catch((err) => {
		console.log(err);
		databse.close();
	});
