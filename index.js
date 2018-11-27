const mysql = require('mysql');
const bodyParser = require('body-parser');
const express = require('express');

const port = 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let con = mysql.createConnection({
  host: "gotdb.cm82qhy60d9y.ap-south-1.rds.amazonaws.com",
  user: "root",
  password: 'password',
  database: "test"
});

var executeQuery = function(res, query){
  con.connect(function (err) {
    if (err) {
      console.log("Error while connecting database :- " + err);
    }

      // query to the database
      con.query(query, function (err, res) {
        if (err) {
          console.log("Error while querying database :- " + err);
          return err;
        }
        else {
          console.log("res came------" ,res);
          return res;
        }
      });
  });
}

app.get('/', (req, res) => {
  res.send("on home page");
})
app.get('/list', (req, response) => {
  let query = 'Select location FROM battles7 WHERE location is NOT NULL AND location <> ""';
  con.connect(function (err) {
    if (err) {
      console.log("Error while connecting database :- " + err);
    }
      // query to the database
      con.query(query, function (err, res) {
        if (err) {
          console.log("Error while querying database :- " + err);
          return err;
        }
        else {
          let arr = [];
          res.forEach(element => {
            arr.push(element.location)
          });
          response.send(arr);
        }
      });
  });
})

app.get('/count', (req, response) => {

  let query = 'select count(battle_number) as count from battles7;'
  con.connect(function (err) {
    if (err) {
      console.log("Error while connecting database :- " + err);
    }
      // query to the database
      con.query(query, function (err, res) {
        if (err) {
          console.log("Error while querying database :- " + err);
          return err;
        }
        else {
          response.send(res);
        }
      });
  });

})


app.get('/stats', (req, response) => {
  
      // query to the database;;
          let resObj = [];
          let query1 = "SELECT attacker_outcome, count(attacker_outcome) as count FROM battles7 GROUP BY attacker_outcome"
          let query = 'select avg(defender_size) as average, min(defender_size) as minimum, max(defender_size) as maximum from battles7;'
          
          con.query(query, function(error, result){
            if (error) {
              return error;
            }
            else {
             resObj= resObj.concat(result)
            }
          })

          con.query(query1, function(error, result1){
            if (error) {
              return error;
            }
            else {
              resObj= resObj.concat(result1)

            }
          })
            let query2 = "select attacker_king, count(attacker_king) as count FROM battles7 GROUP BY attacker_king ORDER BY count DESC LIMIT 1;"
              con.query(query2,function(err, result2){
                if(err){
                  return err
                }
                else{
                  resObj= resObj.concat(result2)
                }
              })

              let query3 = "select defender_king, count(defender_king) as count FROM battles7 GROUP BY defender_king ORDER BY count DESC LIMIT 1;"
              con.query(query3,function(err, result3){
                if(err){
                  return err
                }
                else{
                  resObj= resObj.concat(result3)
                }
              })

              let query4 = "select region, count(region) as count FROM battles7 GROUP BY region ORDER BY count DESC LIMIT 1;"
              con.query(query4,function(err, result4){
                if(err){
                  return err
                }
                else{
                  resObj= resObj.concat(result4)
                }
              })

              let query5 = "select name, count(name) as count FROM battles7 GROUP BY name ORDER BY count DESC LIMIT 1;"
              con.query(query5,function(err, result5){
                if(err){
                  return err
                }
                else{
                  resObj= resObj.concat(result5)
                }
              })

              let query6 = "select distinct battle_type type FROM battles7 ;"
              con.query(query6,function(err, result6){
                if(err){
                  return err
                }
                else{
                  resObj= resObj.concat(result6)
                }
              })

              setTimeout(() => {
                response.send(resObj)
              }, 1000);
      })



app.get('/battle-results', (req, res) => {
  var searchquery = "";
  var searchObj = req.query;
  for (const key in searchObj) {
    if (searchObj.hasOwnProperty(key)) {
      const element = searchObj[key];
      console.log("this is elem ", element)
      if(element != null){
        searchquery = searchquery + " " + key + " = "+ "\'"+element + "\'"+ " AND";
      }
  }
}
  
  searchquery = searchquery.substring(0, searchquery.length - 3)
  let query = "select name from battles7 where" + searchquery;
  con.query(query, function(err, result){
    if(err) return console.log(err);

    res.send(result)
  })
  
})

app.listen(process.env.PORT || port, () => console.log(`Battle app listening on port ${process.env.PORT || port}!`))
