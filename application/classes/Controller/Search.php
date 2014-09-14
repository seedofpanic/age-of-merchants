<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Search extends Controller_Template {

    public function action_goods()
    {
        $this->auto_render = false;
        $dest_id = $this->getParam('dest_id');
        $dest = ORM::factory('building', $dest_id);
        $where = '';
        $where .= 'product_id=' .$this->getParam('product_id') . ' and export=TRUE';
        $where .= ' and goods.building_id<>'.$dest_id;
        $goods = DB::query(Database::SELECT, 'SELECT goods.*,r.name as region,p.name as owner,f.x as x,f.y as y FROM goods
                                                                INNER JOIN buildings b on b.id=goods.building_id
                                                                INNER JOIN map_fields f on f.id=b.field_id
                                                                INNER JOIN map_regions r on r.id=f.region_id
                                                                INNER JOIN profiles p on p.id=b.profile_id
                                                                WHERE '. $where)->execute()->as_array();
        for ($i = 0;$i < count($goods); $i++)
        {
            $shipping = round(sqrt(pow($goods[$i]['x'] - $dest->field->x, 2) + pow($goods[$i]['y'] - $dest->field->y, 2)) * 0.01, 2); // TODO: extend to regions calculation
            $goods[$i]['shipping'] = (($shipping > 0) ? $shipping : 0.01);
        }
        print json_encode($goods);
    }

}
