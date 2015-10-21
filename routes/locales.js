var express = require('express');
var router = express.Router();

var locales = {
    'en': {
        goods: {
            types: {1: 'meat', 2: 'wood'}
        },
        buildings: {
            types: {0: 'Hunting hut', 1: 'woodcutter hut', 2: 'Shop'},
            'statuses': {0: 'constructing', 1: 'active'}
        },
        age_of_merchants: 'Age of Merchants',
        office: {
            'create_new_profile': 'Create new profile',
            'create_btn': 'Create',
            'new_profile_name': 'New profile name',
            'create_first_profile': 'Create your first profile to get your own office',
            'header': 'office.profile_name + "\'s office"',
            'stats': 'Stats',
            'buildings': 'Buildings',
            'construct_building': 'Construct building',
            'name': 'Name',
            'region': 'Region',
            'type': 'Type',
            'status': 'Status',
            'no_buildings': 'No buildings to show, try to construct one',
            'count': 'Count',
            'quality': 'Quality',
            'export': 'Export'
        },
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
            signout: 'Sign out',
            home: 'Home',
            world: 'World',
            profile: 'Profile',
            to_your_office: 'To your office'
        }
    },
    'ru': {
        goods: {
            types: {1: 'Мясо', 2: 'Дерево'}
        },
        buildings: {
            types: {0: 'Охотничья избушка', 1: 'Избушка лесника', 2: 'Магазин'},
            'statuses': {0: 'строится', 1: 'активно'}
        },
        age_of_merchants: 'Век торговли',
        office: {
            'create_new_profile': 'Создать новый профиль',
            'create_btn': 'Создать',
            'new_profile_name': 'Имя нового профиля',
            'create_first_profile': 'Создайте свой первый профиль',
            'header': '"Офис профиля " + office.profile_name',
            'stats': 'Статистика',
            'buildings': 'Предприятия',
            'construct_building': 'Создать предприятие',
            'name': 'Название',
            'region': 'Регион',
            'type': 'тип',
            'status': 'Статус',
            'no_buildings': 'У вас еще нет предприятий, может попробовать создать одно?',
            'count': 'Количество',
            'quality': 'Качество',
            'export': 'Экспорт'
        },
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
            signout: 'Выйти',
            home: 'Главная',
            world: 'Мир',
            profile: 'Профиль',
            to_your_office: 'В Ваш офис'
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
