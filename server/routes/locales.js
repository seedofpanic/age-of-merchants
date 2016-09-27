var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:lang', function(req, res, next) {
    if (req.params.lang.match(/^\w{2}$/)) {
        var locales = require('./../local/' + req.params.lang + '.json');
        if (locales) {
            res.json(locales);
        }
    } else {
        res.status(500).send();
    }
});

module.exports = router;
