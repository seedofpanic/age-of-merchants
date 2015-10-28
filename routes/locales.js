var express = require('express');
var router = express.Router();

var locales = {
    'en': {
        products: {
            types: {1: 'meat', 2: 'wood'}
        },
        buildings: {
            types: {0: 'Hunting hut', 1: 'woodcutter hut', 2: 'Shop'},
            'statuses': {0: 'constructing', 1: 'active'}
        },
        'export': {
            types: {1: 'Once'}
        },
        'order': {
          types: {1: 'Once', 2: 'Every day'}
        },
        'resources': {
            types: {1: 'Forest', 2: 'Animals', 3: 'Soil'}
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
            'price': 'Price',
            'export': 'Export',
            'import': 'Import',
            'import_modal_title': 'Select product to import',
            'new_b_modal_title': 'Construct new building',
            'cancel': 'Cancel',
            'construct': 'Construct',
            'order': 'Order',
            'export_btn': 'Start export',
            'export_s_btn': 'Stop export',
            'stop_export_title': 'Stop export',
            'confirm_stop_export': 'All offers with this product will be canceled! Do you want to stop exporting?',
            'ok': 'OK',
            'export_result': "You will get:",
            'export_type': 'Export type',
            'start_export_title': 'Start product export',
            'order_product_title': 'Order products',
            'order_quantity': 'Order quantity',
            'ballance': 'Ballance'
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
            to_your_office: 'To your office',
            loading: 'Loading'
        },
        map: {
            resource_type: 'Resource type',
            count: 'Count',
            quality: 'Quality',
            growth: 'Growth'
        }
    },
    'ru': {
        products: {
            types: {1: 'Мясо', 2: 'Дерево'}
        },
        buildings: {
            types: {0: 'Охотничья избушка', 1: 'Избушка лесника', 2: 'Магазин'},
            'statuses': {0: 'строится', 1: 'активно'}
        },
        'resources': {
            types: {1: 'Лес', 2: 'Животные', 3: 'Почва'}
        },
        'export': {
            types: {1: 'Один раз'}
        },
        'order': {
            types: {1: 'Один раз', 2: 'Каждый день'}
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
            'price': 'Цена',
            'export': 'Экспорт',
            'import': 'Импорт',
            'import_modal_title': 'Выберите продукт для импорта',
            'new_b_modal_title': 'Создать новое предприятие',
            'cancel': 'Отменить',
            'construct': 'Построить',
            'order': 'Заказать',
            'export_btn': 'Начать экспорт',
            'export_s_btn': 'Остановить экспорт',
            'stop_export_title': 'Остановить экспорт',
            'confirm_stop_export': 'Все сделки с участием этого продукта будут отменены! Вы действительно хотите остановить экспорт?',
            'ok': 'OK',
            'export_result': "Вы получите:",
            'export_type': 'Тип экспорта',
            'start_export_title': 'Начать экспорт товара',
            'order_goods_title': 'Заказ товаров',
            'order_quantity': 'Объем заказа',
            'ballance': 'Балланс'
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
            to_your_office: 'В Ваш офис',
            loading: 'Загрузка'
        },
        map: {
            resource_type: 'Тип ресурса',
            count: 'Количество',
            quality: 'Качество',
            growth: 'Прирост'
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
