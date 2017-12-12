var mysql = require('mysql');

var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "udnamtac",
	database: "pressfile"
});

var sql = "SELECT * FROM Contact"

console.log(sql);

connection.query(sql, function(err, result, fields)  {
    if (err) throw err;

    for (var i = 0; i < result.length; i++) {

        var contactId = result[i].contactId;
        var orgName = result[i].org;

        console.log("ID: " + contactId + " org: " + orgName + " name: " + result[i].firstName + " " + result[i].lastName);

        var sql2 = "SELECT * FROM address WHERE (contactId=" + result[i].contactId + ")";

		var organizationId;

        const dbPromise = new Promise((resolve, reject) => {
			var address1;

        	connection.query(sql2, (err, result2, fields) => {
        		if (err) throw err;

        		console.log(result2);

        		address1 = result2.address1;
        		console.log("Got address: " + address1);

        		resolve(address1);
    		});
    	}).then((address1) => {
    		var sql3 = "SELECT * FROM organization WHERE (name = \"" + orgName + "\") AND (address1 = \"" + address1 + "\")";

    		console.log("SQL 3: " + sql3);

            connection.query(sql3, function(err, result3, fields) {
            	console.log("result 3 : " + result3);

            	if (result3) {

	            	organizationId = result3.organizationId;

	            	console.log("OrgId: " + organizationId);

	            	return organizationId;
	            } else {
	            	return false;
	            }
            });
        }).catch(function(err) {
        	console.log("ERROR! " + err);
        });

        Promise.all([dbPromise]).then((organizationId) => {
        	console.log("ContactID: " + contactId + " OrgId: " + organizationId);
        });

                // }).then((organizationId) => {
        // 	var sql4 = "INSERT INTO contact_organization (contactId, organizationId) VALUES ( " + contactId + ", " + organizationId + ")";

        // 	console.log("SQL4: " + sql4);

        // 	connection.query(sql4, (err, result4) => {
        // 		console.log(result4);
        // 	});


        // Promise.all([selectAddress, orgPromise])
        // .then(([address,orgId]) =>{
        //    var sql4 = "INSERT INTO contact_organization (contactId, organizationId) VALUES ( " + contactId + ", " + orgIdId + ")";

        //   connection.query(sql4, function(err, uRes) {
        //       // console.log("Address updated " + addressId + " " + contactId);
        //   });
        
        // })
        // .catch(function(err) {
        // 	console.log("ERROR! " + err);
        // });



        if (i > 3) {
        	break;
        }
    }


	connection.end();
});
