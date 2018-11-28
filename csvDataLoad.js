const fs = require('fs');
const mysql = require('mysql');
const csv = require('fast-csv');

let stream = fs.createReadStream("battles.csv");
let myData = [];
let csvStream = csv
    .parse()
    .on("data", function (data) {
        myData.push(data);
    })
    .on("end", function () {
        myData.shift();

        // create a new connection to the database
        const connection = mysql.createConnection({
            host: 'gotdb.cm82qhy60d9y.ap-south-1.rds.amazonaws.com',
            user: 'root',
            password: 'password',
            database: 'test'
        });

        // open the connection
        connection.connect((error) => {
            if (error) {
                console.error(error);
            } else {
                console.log("came in ");
                
                createQuery = 'create table battles101 (name varchar(500),year varchar(500),battle_number varchar (6),attacker_king varchar(500),defender_king varchar(500),attacker_1 varchar(500),attacker_2 varchar(500),attacker_3 varchar(500),attacker_4 varchar(500),defender_1 varchar(500),defender_2 varchar(500),defender_3 varchar(500),defender_4 varchar(500),attacker_outcome varchar(500),battle_type varchar(500),major_death varchar(500),major_capture varchar(500),attacker_size varchar(500),defender_size varchar(100),attacker_commander varchar(500),defender_commander varchar(500),summer varchar(500),location varchar(500),region varchar(500),note varchar(500));';
                connection.query(createQuery, (err, res) => {
                    if (err) return console.log(err);
                    console.log("was came in ");
                    let query = 'INSERT INTO battles101 (name,year,battle_number,attacker_king,defender_king,attacker_1,attacker_2,attacker_3,attacker_4,defender_1,defender_2,defender_3,defender_4,attacker_outcome,battle_type,major_death,major_capture,attacker_size,defender_size,attacker_commander,defender_commander,summer,location,region,note) VALUES ?';
                    connection.query(query, [myData], (error, response) => {
                        if(error) return console.log(error)
                        
                        console.log("came in was ");
                        console.log(response);
                    });
                })

            }
        });
    });

stream.pipe(csvStream)
