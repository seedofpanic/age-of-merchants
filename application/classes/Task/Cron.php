<?php defined('SYSPATH') or die('No direct script access.');

class Task_Cron extends Minion_Task {

    protected $_options = array(
        0 => ''
    );

    public function _execute(array $array)
    {
        Database::instance('default')->connect();
        $config = Kohana::$config->load('buildings_types');

        $building_types = $config->types;
        $building_props = $config->params;

        $buildings = Model::factory('building')->find_all();


        foreach ($buildings as $building)
        {
            switch ($building->status)
            {
                case 'building':
                    $building->buildtime --;
                    if ($building->buildtime < 1)
                    {
                        $building->status = 'active';
                    }
                    break;
                case 'active':
                    foreach ($building_props[$building->type]['resources_out'] as $resource)
                    {
                        $building->addGoods($resource, 1, 1);
                    }
                    break;
            }
            $building->save();
        }
    }
}