<?php defined('SYSPATH') or die('No direct script access.');

class Task_Updatedb extends Minion_Task {

    protected $_options = array(
        0 => ''
    );

    public function _execute(array $array)
    {
        $this->safeAddField('goods', 'price', 'float UNSIGNED DEFAULT 0.01');
        $this->safeAddField('goods', 'export', 'tinyint(1) DEFAULT 0');

        $this->safeCreateTable('contracts');
        $this->safeAddField('contracts', 'goods_id', 'int(11) DEFAULT 0');
        $this->safeAddField('contracts', 'dest_id', 'int(11) DEFAULT 0');
        $this->safeAddField('contracts', 'count', 'int(11) DEFAULT 0');
        $this->safeAddKey('contracts', 'KEY', 'fk_goods_id', array('goods_id'));
        $this->safeAddKey('contracts', 'KEY', 'fk_dest_id', array('dest_id'));

    }

    protected function safeCreateTable($tableName)
    {
        $key = DB::select('*')->from('information_schema.TABLES')->where('TABLE_SCHEMA', '=', 'aom')->where('TABLE_NAME', 'like', $tableName)->execute();
        if ($key->count() == 0)
        {
            DB::query(NULL, 'CREATE Table `' . $tableName . '` (`id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,PRIMARY KEY  (`id`))ENGINE=InnoDB  DEFAULT CHARSET=utf8;')->execute();
        }
    }

    protected function safeAddField($tableName, $fieldName, $fieldType)
    {
        $key = DB::select('*')
            ->from('information_schema.COLUMNS')
            ->where('TABLE_SCHEMA', '=', 'aom')
            ->where('TABLE_NAME', 'like', $tableName)
            ->where('COLUMN_NAME', 'like', $fieldName)
            ->execute();
        if ($key->count() == 0)
        {// TODO: add field type check, and update if diff
            DB::query(NULL, 'ALTER Table ' . $tableName . ' add `' . $fieldName . '` ' . $fieldType)->execute();
        }
    }

    private function safeAddKey($tableName, $type, $name, $fields)
    {
        $key = DB::select('*')
            ->from('information_schema.STATISTICS')
            ->where('TABLE_SCHEMA', '=', 'aom')
            ->where('TABLE_NAME', 'like', $tableName)
            ->where('INDEX_NAME', 'like', $name)
            ->execute();
        if ($key->count() == 0)
        {
            if ($name === 'PRIMARY')
            {
                $name = '';
            }else{
                $name = '`' . $name . '`';
            }
            for ($i = 0; $i < count($fields); $i++)
            {
                $fields[$i] = '`' . $fields[$i] . '`';
            }
            DB::query(NULL, 'ALTER Table ' . $tableName . ' add ' . $type.' ' . $name . ' (' . join(',', $fields) . ')')->execute();
        }
    }
}