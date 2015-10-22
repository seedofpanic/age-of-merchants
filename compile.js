var exec = require('child_process').exec;
exec('coffee --join public/javascripts/app.js -c public/javascripts', function (error, stdout, stderr) {
    if (!error) {
        console.log('making coffe ok!');
    }
});
exec('uglifyjs -o "public/javascripts/app.min.js" "public/javascripts/app.js"', function (error, stdout, stderr) {
    if (!error) {
        console.log('ugligying ok!');
    }
});
exec('jade public/partials', function (error, stdout, stderr){
    if (!error) {
        console.log('Jades done ok!')
    }
});