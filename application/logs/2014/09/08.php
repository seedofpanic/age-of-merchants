<?php defined('SYSPATH') OR die('No direct script access.'); ?>

2014-09-08 13:56:15 --- CRITICAL: Kohana_Exception [ 0 ]: A valid cookie salt is required. Please set Cookie::$salt in your bootstrap.php. For more information check the documentation ~ SYSPATH\classes\Kohana\Cookie.php [ 151 ] in Z:\home\localhost\www\system\classes\Kohana\Cookie.php:67
2014-09-08 13:56:15 --- DEBUG: #0 Z:\home\localhost\www\system\classes\Kohana\Cookie.php(67): Kohana_Cookie::salt('LocalTimeZone', NULL)
#1 Z:\home\localhost\www\system\classes\Kohana\Request.php(151): Kohana_Cookie::get('LocalTimeZone')
#2 Z:\home\localhost\www\index.php(117): Kohana_Request::factory(true, Array, false)
#3 {main} in Z:\home\localhost\www\system\classes\Kohana\Cookie.php:67