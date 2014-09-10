<?php defined('SYSPATH') OR die('No direct access allowed.');

class Model_User extends Model_Auth_User {

	protected $_has_one = array('profile' => array('model' => 'profile', 'foreign_key' => 'user_id'));

} // End User Model