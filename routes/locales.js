var express = require('express');
var router = express.Router();

var locales = {
    'en': {
        buildings: {0: 'Hunting hut', 1: 'Sawmill', 2: 'Shop'},
        site: {
            language: 'Language',
            auth: {
                login: 'Log-in to your account',
                email: 'E-mail address',
                username: 'Username',
                password_r: 'Repeat Password',
                password: 'Password',
                login_btn: 'Login',
                registration: 'Registration',
                register_btn: 'Register'
            },
            welcome: 'Welcome',
            signin: 'Sign in',
            signup: 'Sign up',
            signout: 'Sign out'
        }
    },
    'ru': {
        buildings: {0: 'Охотничья избушка', 1: 'Лесопилка', 2: 'Магазин'},
        site: {
            language: 'Язык',
            auth: {
                login: 'Войти в ваш аккаунт',
                email: 'E-mail адрес',
                username: 'Имя пользователя',
                password_r: 'Повторите пароль',
                password: 'Пароль',
                login_btn: 'Войти',
                registration: 'Регистрация',
                register_btn: 'Зарегистрироваться'
            },
            welcome: 'Добро пожаловать',
            signin: 'Войти',
            signup: 'Зарегистроваться',
            signout: 'Выйти'
        }
    }
};

/* GET home page. */
router.get('/:lang', function(req, res, next) {
    if (locales[req.params.lang]) {
        res.send(locales[req.params.lang]);
    }
});

module.exports = router;
