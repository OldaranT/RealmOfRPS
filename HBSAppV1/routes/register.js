/**
 * Created by Tim on 17-3-2017.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('register', { title: 'Register' });
});

module.exports = router;
