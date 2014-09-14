<?php defined('SYSPATH') or die('No direct script access.');

class Task_Updatedb extends Minion_Task {

    protected $_options = array(
        0 => ''
    );

    public function _execute(array $array)
    {
        //goods.price
        $key = DB::select('*')->from('information_schema.COLUMNS')->where('TABLE_SCHEMA', '=', 'aom')->where('TABLE_NAME', 'like', 'goods')->where('COLUMN_NAME', 'like', 'price')->execute();
        if ($key->count() == 0)
        {
            DB::query(NULL, 'ALTER Table goods add `price` float UNSIGNED DEFAULT 0.01')->execute();
        }

        //goods.export
        $key = DB::select('*')->from('information_schema.COLUMNS')->where('TABLE_SCHEMA', '=', 'aom')->where('TABLE_NAME', 'like', 'goods')->where('COLUMN_NAME', 'like', 'export')->execute();
        if ($key->count() == 0)
        {
            DB::query(NULL, 'ALTER Table goods add `export` tinyint(1) DEFAULT 0')->execute();
        }
    }
}