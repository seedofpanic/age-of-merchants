<?php defined('SYSPATH') or die('No direct script access.');

return array(
    'types' => array('sawmill', 'hunting', 'shop'),
    'names' => array('en' => array('hunting' => 'Hunting hut', 'sawmill' => 'Sawmill', 'shop' => 'Shop')),
    'params' => array('sawmill' =>
                        array(
                            'build_time' => 1,
                            'resources_out' => array(2)
                        ),
                      'hunting' =>
                        array(
                            'build_time' => 2,
                            'resources_out' => array(1)
                        ),
                      'shop'    =>
                        array(
                            'build_time' => 3,
                            'resources_out' => array()
                        )
    )
);