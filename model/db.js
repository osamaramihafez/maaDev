const Client = require('pg').Client;

const db = new Client({
  user: 'maadmin',
  password: 'perfectPassword123!',
  host: 'localhost',
  port: 5432,
  database: 'website'
})

db.connect()
.then(() => console.log('Connected to db successfully'))
.catch(e => console.log(e));

module.exports = db;
