<?php defined('SYSPATH') OR die('No direct access allowed.');

class Model_Building extends ORM {
	
	protected $_belongs_to = array('field' => array('model' => 'map_field', 'foreign_key' => 'field_id'),
                                    'owner' => array('model' => 'profile', 'foreign_key' => 'profile_id'));
    protected $_has_many = array( 'goods' => array('model' => 'goods', 'foreign_key' => 'building_id'));

    public function addGoods($product_id, $count, $quality)
    {
        $goods = ORM::factory('goods')->where('building_id', '=', $this->id)->where('product_id', '=', $product_id)->find();
        if (!$goods->loaded())
        {
            $goods->building_id = $this->id;
            $goods->product_id = $product_id;
        }
        $old_count = $goods->count;
        $old_quality = $goods->quality;
        $goods->quality = ($old_quality * $old_count + $quality * $count) / ($old_count + $count);
        $goods->count = ($old_count + $count);
        $goods->save();
    }
}