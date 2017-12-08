var fms = require('fms-js');
 
// create a connection object 
 
var connection = fms.connection({
    url : 'ucp-fm-vm1.uchicago.edu',
    userName : 'smallco',
    password : 'patience'
});
 
var db = connection.db('Schema');

connection.dbnames().send(function(err, res) {
    console.log(res);
})
var layout = db.layout('Table');
// var request = layout.find({
//     'Organization' : 'Copeia'  
// });

// request.send(function() {
//     console.log(this);
// });

layout.findall().send(function(err, res) {
    if (err) {
        console.log("Error: " + err);
    }

    // console.log(res);
});