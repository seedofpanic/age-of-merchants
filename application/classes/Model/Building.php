<?php defined('SYSPATH') OR die('No direct access allowed.');

class Model_Building extends ORM {
	
	protected $_belongs_to = array('field' => array('model' => 'field', 'foreign_key' => 'field_id'));


}