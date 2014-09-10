<?php defined('SYSPATH') OR die('No direct access allowed.');

class Model_Map_Field extends ORM {
	
	protected $_belongs_to = array('region' => array('model' => 'map_region', 'foreign_key' => 'region_id'));


}