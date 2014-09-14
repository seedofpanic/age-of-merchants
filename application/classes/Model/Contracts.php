<?php defined('SYSPATH') OR die('No direct access allowed.');

class Model_Contract extends ORM {
    protected $_belongs_to = array('goods' => array('model' => 'goods', 'foreign_key' => 'goods_id'),
        'dest' => array('model' => 'building', 'foreign_key' => 'dest_id'));
}