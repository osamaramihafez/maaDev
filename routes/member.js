// This file contains all of the routes that handle all member related api requests etc.

const router = require('express').Router();
const m = require('../model/member');
  
INTERNALERROR = {error: "Server Could not process the request"}
DUPLICATE = {error: "Duplicate"}
  
router.post('/api/addMember', (req, res) => {
    // returns member information in json format if successful
    res.header('Access-Control-Allow-Origin', '*');
    m.createMember(req.body,  member => {
      if (member == false){
        res.status(500);
        res.json(INTERNALERROR);
        return;
      }
      if (member == "Duplicate"){
        res.status(500);
        res.json(DUPLICATE);
        return;
      }
      res.status(200);
      res.json(member);
    });
})
  
router.get('/api/getMember', (req, res) => {
    // Returns id of a Member in json format
    res.header('Access-Control-Allow-Origin', '*');
    m.getMember(req.body,  member_id => {
      if (member_id == false){
        res.status(500);
        res.json(INTERNALERROR);
        return;
      }
      res.status(200); //This needs a check
      res.json({id:member_id});
    });
})
  
router.post('/api/register', (req, res) => {
    // Register for a program, and store the information in the database.
    res.header('Access-Control-Allow-Origin', '*');
    m.register(req.body, status => {
      if (status == false){
        res.status(500);
        res.json(INTERNALERROR);
        return;
      }
      if (status == "Duplicate"){
        res.status(409);
        res.json(DUPLICATE);
        return;
      }
      res.status(200); //This needs a check i.e. if status.registered = true
      res.json(status);
      return;
    });
})
  
  
router.get('/api/getMembers', (req, res) => {
    // Return all of the members in the database.
    res.header('Access-Control-Allow-Origin', '*');
    m.getMembers(req.body).then(members => {
      if (members == false){
        res.status(500);
        res.json(INTERNALERROR);
        return;
      }
      res.status(200);
      res.json(members);
    });
})

router.get('/api/programMembers/:program', (req, res) => {
  // Return all of the members in the database.
  res.header('Access-Control-Allow-Origin', '*');
  m.getProgramMembers(req.params, members => {
    if (members == false){
      res.status(500);
      res.json(INTERNALERROR);
      return;
    }
    res.status(200);
    res.json(members);
  });
})

router.get('/api/programMembers/:program/:member', (req, res) => {
  // Return all of the members in the database.
  res.header('Access-Control-Allow-Origin', '*');
  m.getProgramMember(req.params, members => {
    if (members == false){
      res.status(500);
      res.json(INTERNALERROR);
      return;
    }
    res.status(200);
    res.json(members);
  });
})

router.get('/api/getMembersCSV', (req, res) => {
    // Generate a CSV file that contains all members and store it in the assets/csv file.
    res.header('Access-Control-Allow-Origin', '*');
    m.getMembersCSV(req.body, success => {
      if (success == false){
        res.status(500);
        res.json(INTERNALERROR);
        return;
      }
      res.status(200);
      res.download('./assets/csv/members.csv');
    });
})

module.exports = router;
