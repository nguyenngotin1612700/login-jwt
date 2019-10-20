var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const userModel = require('../Model/Users')
const passport = require('passport');


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/* GET user profile. */
router.get('/me', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  res.send(req.user);
});

/* POST login. */
router.post('/login', function (req, res, next) {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: 'Something is not right',
        user: user
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      //generate a signed son web token with the contents of user object and return it in the response
      const token = jwt.sign({ email: user.email, name: user.name, _id: user._id }, 'your_jwt_secret');
      return res.json({ email: user.email, name: user.name, token });
    });
  })(req, res);
});

router.post('/register', function (req, res, next) {
  if (!req.body.email || !req.body.name || !req.body.password) {
    res.send('please input email, name, password to create account!!!!');
    return;
  }
  userModel.findOne({ email: req.body.email }).then((currentUser) => {
    if (currentUser) {
      res.send("create account failed, email is already exist!!!")
    } else {
      let newUser = new userModel({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password
      });
      newUser.save();
      res.send('create account successfully!!!');
    }
  })
});

module.exports = router;
