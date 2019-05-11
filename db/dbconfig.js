var mysql = require('mysql');


var connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  database:'kindermorgandb',
  password: ""
});

// connection.connect(function(error){
//     if(!!error){
//         console.log('Error');
//     }
//     else{
//         console.log('Connected');
//     }
// });


// let kinderdb = {};

// kinderdb.all=()=>{
//  return new Promise((resolve,reject)=>{
//   connection.query('select * from categories',(err, results)=>{
//     if(err){
//         return reject(err);
//     }
//     return resolve(results);
//    });
//  });
// };


module.exports=connection;
