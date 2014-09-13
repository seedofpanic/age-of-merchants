<?php defined('SYSPATH') or die('No direct script access.');

return array(
        'types' => array('sawmill', 'hunting'),
    'params' => array('sawmill' =>
                        array(
                            'build_time' => 1,
                            'resources_out' => array(2)
                        ),
                      'hunting' =>
                        array(
                            'build_time' => 2,
                            'resources_out' => array(1)
                        )
    )
);