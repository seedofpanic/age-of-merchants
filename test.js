var models = require('./models/index.js');
models.profiles.find({where: {id: 1}}).then(function (profile) {
   profile.save().then(function (profile) {
       console.log('ok')
   }, function (err) {
       console.log(err)
   })
});