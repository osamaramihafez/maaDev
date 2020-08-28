
const Client = require('pg').Client;
const db = new Client({
  user: 'maadmin',
  password: 'VeryG00dPa$$word',
  host: 'localhost',
  port: 5432,
  database: 'maadmin'
})

db.connect()
.then(() => console.log('Connected to db successfully'))
.catch(e => console.log(e));

module.exports.login = function login(username, password, respond){
    /*This login function should do two things:
         1. Check to see if the login credentials for an admin are valid
         2. Create an admin object based on the valid credentials
    */
    var sql = 'SELECT password FROM admin WHERE username=$1;';
    db.query(sql, [username]).then(result => {
        var login = {
        success: false
        }
        var admin;
        if (result.rows[0] == null){
            console.log("Username does not exist.");
            if (isFunction(respond)) respond(login);
            return;
        }
        var correctPass = result.rows[0].password;
        if (password === correctPass){
            login.success = true
            admin = new Admin(username);
            users[username] = admin;
            console.log("Password correct.");
            if (isFunction(respond)) respond(login);
            return;
        }
        console.log("Password incorrect.");
        if (isFunction(respond)) respond(login);
        return;
    }).catch(e => {
        console.log("\nLOGIN ERROR!\n");
        console.log(e);
        return e;
    })
}

class Admin{
    constructor(username, key){
        //Each administrator should have a name/id (and a key? for sessions/caching? idk yet).
        this.name = username;
        this.key = key;
    }
}