<?php defined('SYSPATH') OR die('No direct access allowed.');

class Model_Profile extends ORM {

	protected $_has_many = array('buildings' => array('model' => 'building', 'foreign_key' => 'profile_id'));

}