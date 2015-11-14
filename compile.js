var exec = require('child_process').exec;
exec('coffee --join public/javascripts/app.js -c public/javascripts', function (error, stdout, stderr) {
    if (error) {
        console.log('something goes wrong, please try: npm install -g coffee-script');
        console.log(error);
    } else {
        console.log('making coffe ok!');
    }
}, function () {
    exec('uglifyjs -o "public/javascripts/app.min.js" "public/javascripts/app.js"', function (error, stdout, stderr) {
        if (error) {
            console.log('something goes wrong, please try: npm install -g uglifyjs');
            console.log(error);
        } else {
            console.log('uglifying ok!');
        }
    });
});
exec('jade public/partials', function (error, stdout, stderr){
    if (error) {
        console.log('something goes wrong, please try: npm install -g jade');
        console.log(error);
    } else {
        console.log('Jades done ok!')
    }
});