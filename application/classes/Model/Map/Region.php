<?php defined('SYSPATH') OR die('No direct access allowed.');

class Model_Map_region extends ORM {

    protected $_has_many = array('fields' => array('model' => 'map_field', 'foreign_key' => 'region_id'));

}