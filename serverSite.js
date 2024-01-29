const express = require("express");
const Parser = require("body-parser");
const bodyParser = require("body-parser");
const mysql=require("mysql2")
const app =express()
const port =process.env.POTT || 5000
// const db =require('./config/database');
// const modelexpor =require('./models/index')
const cors =require("cors")
app.use( bodyParser.urlencoded({extended:true}))
app.use( bodyParser.json())

app.use(cors())




///////////////////////CNX SQL//////////////////
// const db2 = mysql.createConnection({
//  host: "91.134.151.72",
//   user: "brzukxvw_STS",
//   password: "6$bT~{h8PgAf",
//   database: "brzukxvw_GSTS"
// }); 
const db2 = mysql.createConnection({
 host: "localhost",
  user: "root",
  password: "",
  database: "brzukxvw_STS"
}); 

// Établir la connexion à la base de données
db2.connect(err => {
    if (err) {
      console.error('Erreur de connexion à la base de données :', err);
    } else {
      console.log('Connexion à la base de données réussie.');
    }
  });



  app.post("/login2", (req, res) => {
    //console.log(req.headers.authorization);
    
    const sql_ = "SELECT Cuve.cuve_id FROM `Cuve` WHERE Token=?";
    
    db2.query(sql_, [req.headers.authorization], (err, data) => {
      if (err) {
        console.error('Erreur lors de l\'exécution de la requête SQL :', err);
        return res.status(500).send('Erreur serveur');
      }else{
  
    let qte_ =	100			
      const sqlInser="INSERT INTO `mesure_cuve`( `date`, `Level`, `CuveId`, `AlarmeLevel`, `AlarmeBattery`, `Volt`, `Rsrp`,`Qte`) VALUES (?,?,?,?,?,?,?,?)"
            db2.query(sqlInser,[dateheur(),req.body.height  ,data[0].cuve_id  ,req.body.empty_alarm,  req.body.battery_alarm  ,req.body.volt ,req.body.rsrp,qte_] ,(err_,date__)=>{
                if (err_) {
                    console.error('Erreur lors de l\'exécution de la requête SQL :', err);
                    return res.status(500).send('Erreur serveur');
                  }
      // Faites quelque chose avec les données ici (envoyer une réponse, etc.)
      res.status(200).json(date__);
      })};
  });
});




app.post("/login", (req, res) => {
    const sql = "SELECT  Clients.Host,Clients.bdd,Clients.UserName,Clients.passeword ,Tokens.id from Clients ,Tokens WHERE token=? and Tokens.IDClient=Clients.IDClient;";
    db2.query(sql, [req.headers.authorization],(err,data_)=>{
        const db3 = mysql.createConnection({
            host: data_[0].Host ,
            user: data_[0].UserName,
            password: data_[0].passeword,
            database: data_[0].bdd
          });
          const sql_ = "SELECT  Cuve.cuve_id FROM `Cuve` WHERE IDTokens=?";
          db3.query(sql_, [data_[0].id],(err_,data__)=>{


        console.log("-----------------------------------------------------------------------------------",req.body.volt);

            const sqlInser="INSERT INTO `Mesur`( `date`, `Level`, `CuveCuveId`, `AlarmeLevel`, `AlarmeBattery`, `Volt`, `Rsrp`) VALUES (?,?,?,?,?,?,?)"
            db3.query(sqlInser,[dateheur(),req.body.height  ,data__[0].cuve_id  ,req.body.empty_alarm,  req.body.battery_alarm  ,req.body.volt ,req.body.rsrp] ,(err___,date_____)=>{
            
            })






     } )
          });
          

return res.json("okk");
    });
  

app.listen(port, () => { 
    console.log(`Server is running on port yes `);
  })


function dateheur (){
    const currentDate = new Date();

// Get the individual components of the date and time
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1; // Months are 0-based, so add 1
const day = currentDate.getDate();
const hours = currentDate.getHours();
const minutes = currentDate.getMinutes();
const seconds = currentDate.getSeconds();

// Format the date and time as a string
const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;


return formattedDate

}
