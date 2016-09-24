var exec = require('child_process').exec;
exec('jade public/partials', function (error, stdout, stderr){
    if (error) {
        console.log('something goes wrong, please try: npm install -g jade');
        console.log(error);
    } else {
        console.log('Jades done ok!')
    }
});