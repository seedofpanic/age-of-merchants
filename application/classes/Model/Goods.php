<?php defined('SYSPATH') OR die('No direct access allowed.');

class Model_Goods extends ORM {
    protected $_table_name = 'goods';
    protected $_belongs_to = array('product' => array('model' => 'product', 'foreign_key' => 'product_id'));
}