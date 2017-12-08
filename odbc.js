var db = require('node-odbc')
  , cn = "DRIVER={FreeTDS];SERVER=ucp-fm-vm1;UID=smallco;PWD=patience;DATABASE=Schema"
  ;

db.open(cn, function (err) {
  if (err) return console.log(err);
  
  db.query('select * from user where user_id = ?', [42], function (err, data) {
    if (err) console.log(err);
    
    console.log(data);

    db.close(function () {
      console.log('done');
    });
  });
});