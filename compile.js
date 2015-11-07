var exec = require('child_process').exec;
exec('coffee --join public/javascripts/app.js -c public/javascripts', function (error, stdout, stderr) {
    if (error) {
        console.log('something goes wrong, please try: npm install -g coffe-script');
    } else {
        console.log('making coffe ok!');
    }
});
exec('uglifyjs -o "public/javascripts/app.min.js" "public/javascripts/app.js"', function (error, stdout, stderr) {
    if (error) {
        console.log('something goes wrong, please try: npm install -g uglifyjs');
    } else {
        console.log('uglifying ok!');
    }
});
exec('jade public/partials', function (error, stdout, stderr){
    if (error) {
        console.log('something goes wrong, please try: npm install -g jade');
    } else {
        console.log('Jades done ok!')
    }
});