var express = require('express');
var router = express.Router();
var template = require('../lib/template');
var db = require('../lib/db');
const bcrypt = require('bcrypt');
module.exports = function(passport){

//로그인 화면
router.get('/login', function(req, res) {
  var fmsg = req.flash();
  var feedback = '';
  if(fmsg.error){
    feedback = fmsg.error[0];
  }
  html = template.HTML(`
    <div style= "color:red">${feedback}</div>
    <form action = "/u/login_process" method = "post">
      <p><input type = "text" name = "email" placeholder="email">
      <p><input type = "password" name = "pw" placeholder="password">
      <p><input type = "submit" value= "로그인">
    </form>
    `)
  res.send(html);
});

//passport가 로그인을 처리하는 과정
router.post('/login_process',
  passport.authenticate('local', { 
    successRedirect: '/o',
    failureRedirect: '/u/login', 
    failureFlash: true}));

// 회원가입
router.get('/register', function(req, res) {
  var fmsg = req.flash();
  var feedback = '';
  if(fmsg.error){
    feedback = fmsg.error[0];
  }
  html = template.HTML(`
    <div style= "color:red">${feedback}</div>
    <form action = "/u/register_process" method = "post">
      <p><input type = "text" name = "email" placeholder="email"></p>
      <p><input type = "password" name = "pwd" placeholder="password"></p>
      <p><input type = "password" name = "pwd2" placeholder="password"></p>
      <p><input type = "text" name= "displayName" placeholder="display name"</p>
      <p><input type = "submit" value= "회원가입"></p>
    </form>
    `)
  res.send(html);
});

//회원가입 과정 각종 검증이 필요하다.(ex. email들어가서 인증을 받아야 권한 풀어주기, 중복되는 아이디 있는가 검증)
router.post('/register_process', function (req, res, next) {
  var email =req.body.email;
  var pwd = req.body.pwd;
  var pwd2 = req.body.pwd2;
  var displayName = req.body.displayName;
  if(pwd !== pwd2){
    req.flash('error', '비밀번호가 같지 않습니다.')
    res.redirect('/u/register');
  }else{
    bcrypt.hash(pwd, 10, function (err, hash){
      db.query('INSERT INTO user (email, pwd, displayName) VALUES(?, ?, ?)',[email, hash, displayName], function(err, result){
        if(err) throw err;
        db.query('SELECT * FROM user ORDER BY id DESC LIMIT 1', function(err, result){
          if(err) throw err;
          req.login(result[0], function(err){
            if(err) throw err;
            return res.redirect('/o');
          })
        })
      });
    })
    
  }
})

//로그아웃
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/o')
});

  return router;
}

  
