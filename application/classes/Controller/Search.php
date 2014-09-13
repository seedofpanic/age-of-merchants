<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Search extends Controller_Template {

    public function action_goods()
    {
        $this->auto_render = false;
        print json_encode(DB::query(Database::SELECT, 'SELECT goods.*,r.name as region,p.name as owner FROM goods
                                                                INNER JOIN buildings b on b.id=goods.building_id
                                                                INNER JOIN map_fields f on f.id=b.field_id
                                                                INNER JOIN map_regions r on r.id=f.region_id
                                                                INNER JOIN profiles p on p.id=b.profile_id
                                                                WHERE product_id=' .$this->getParam('product_id'))->execute()->as_array());
    }

}
