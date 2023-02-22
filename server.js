const express = require('express')
const port = 5000
const bodyParser = require('body-parser');
const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('static'));

var mysql = require('mysql2');

var con = mysql.createConnection({
  host: "sql12.freemysqlhosting.net",
  user: "ADD USER HERE",
  password: "ADD PASSWORD HERE",
  database: "ADD DATABASE HERE"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
  })

  
app.get('/*', function (req, res) {
    console.log(req['params']['0'])
    const search = req['params']['0']


    con.query('SELECT URL FROM mapping where shortURL = '+ mysql.escape(search), (err,rows) => {
        if(err) throw err;
      
        console.log('Data received from Db:');
        if (rows.length !=0)
        {
        console.log(rows[0]['URL']);
        const value  = rows[0]['URL'];
        console.log(value);
        res.redirect(value)
        }
        else 
        {
            res.send('404 Sorry')
        }
      });

});



app.post('/', function (req, res) {
    con.query('SELECT URL FROM mapping where shortURL = '+ mysql.escape(req['body']['lname']), (err,rows) => {
        if(err) throw err;
      
        console.log('Data received from Db:');
        console.log(req['body']['lname'])
        console.log(req['body']['fname'])
        if (rows.length !=0)
        {
            res.send('Already Taken')
        }
        else
        {
            con.query('insert into mapping(URL,shortURL) values( '+ mysql.escape(req['body']['fname'])+','+mysql.escape(req['body']['lname'])+')', (err,rows) => {
                if (err) throw err;
               res.redirect(req['body']['fname'])
            })
        }
  })
});

  
app.listen(port,()=>{
    console.log(`Server started on port ${port}`);
});

