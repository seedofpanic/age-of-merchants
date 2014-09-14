<?php defined('SYSPATH') or die('No direct script access.');

class Task_Updatedb extends Minion_Task {

    private $dbname;

    protected $_options = array(
        0 => ''
    );

    public function _execute(array $array)
    {
        $this->dbname = Kohana::$config->load('database.default.connection.database');

        $this->safeCreateTable('roles');
        $this->safeAddField('roles', 'name', 'varchar(32) NOT NULL');
        $this->safeAddField('roles', 'description', 'varchar(255) NOT NULL');
        $this->safeAddKey('roles', 'UNIQUE KEY', 'uniq_name', array('name'));

        DB::query(Database::INSERT, "INSERT IGNORE INTO `roles` (`id`, `name`, `description`) VALUES(1, 'login', 'Login privileges, granted after account confirmation'");
        DB::query(Database::INSERT, "INSERT IGNORE INTO `roles` (`id`, `name`, `description`) VALUES(2, 'admin', 'Administrative user, has access to everything.'");

        $this->safeCreateTable('roles_users', array('user_id', 'role_id'));
        $this->safeAddKey('roles_users', 'KEY', 'fk_role_id', array('role_id'));
        $this->safeAddConstraint('roles_users', 'roles_users_ibfk_1', 'FOREIGN KEY', '(`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE');
        $this->safeAddConstraint('roles_users', 'roles_users_ibfk_2', 'FOREIGN KEY', '(`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCAD');

        $this->safeCreateTable('users');
        $this->safeAddField('users', 'email', 'varchar(254) NOT NULL');
        $this->safeAddField('users', 'username', "varchar(32) NOT NULL DEFAULT '''");
        $this->safeAddField('users', 'password', "varchar(64) NOT NULL");
        $this->safeAddField('users', 'logins', "int(10) UNSIGNED NOT NULL DEFAULT '0'");
        $this->safeAddField('users', 'last_login', "int(10) UNSIGNED");
        $this->safeAddKey('users', 'UNIQUE KEY', 'uniq_username', array('username'));
        $this->safeAddKey('users', 'UNIQUE KEY', 'uniq_email', array('email'));

        $this->safeCreateTable('user_tokens');
        $this->safeAddField('user_tokens', 'user_id', 'int(11) UNSIGNED NOT NULL');
        $this->safeAddField('user_tokens', 'user_agent', 'varchar(40) NOT NULL');
        $this->safeAddField('user_tokens', 'token', 'varchar(40) NOT NULL');
        $this->safeAddField('user_tokens', 'created', 'int(10) UNSIGNED NOT NULL');
        $this->safeAddField('user_tokens', 'expires', 'int(10) UNSIGNED NOT NULL');
        $this->safeAddKey('user_tokens', 'UNIQUE KEY', 'uniq_token', array('token'));
        $this->safeAddKey('user_tokens', 'KEY', 'fk_user_id', array('user_id'));
        $this->safeAddKey('user_tokens', 'KEY', 'expires', array('expires'));
        $this->safeAddConstraint('user_tokens', 'user_tokens_ibfk_1', 'FOREIGN KEY', '(user_id) REFERENCES users (id) ON DELETE CASCADE');

        $this->safeCreateTable('profiles');
        $this->safeAddField('profiles', 'user_id', 'int(11) UNSIGNED NOT NULL');
        $this->safeAddField('profiles', 'name', "varchar(40) NOT NULL DEFAULT 'undef'");
        $this->safeAddField('profiles', 'gold', "double(15, 2) UNSIGNED DEFAULT 0");
        $this->safeAddKey('profiles', 'KEY', 'fk_user_id', array('user_id'));

        $this->safeCreateTable('map_regions');
        $this->safeAddField('map_regions', 'x', 'tinyint UNSIGNED NOT NULL');
        $this->safeAddField('map_regions', 'y', "tinyint UNSIGNED NOT NULL");
        $this->safeAddField('map_regions', 'name', "varchar(32) NOT NULL DEFAULT 'region'");

        $this->safeCreateTable('map_fields');
        $this->safeAddField('map_fields', 'region_id', "int(11) UNSIGNED NOT NULL");
        $this->safeAddField('map_fields', 'x', 'tinyint UNSIGNED NOT NULL');
        $this->safeAddField('map_fields', 'y', "tinyint UNSIGNED NOT NULL");

        $this->safeCreateTable('buildings');
        $this->safeAddField('buildings', 'profile_id', "int(11) UNSIGNED NOT NULL");
        $this->safeAddField('buildings', 'field_id', "int(11) UNSIGNED NOT NULL");
        $this->safeAddField('buildings', 'name', "varchar(32) NOT NULL DEFAULT 'building'");
        $this->safeAddField('buildings', 'buildtime', "tinyint(3) UNSIGNED DEFAULT NULL");
        $this->safeAddField('buildings', 'status', "enum ('building', 'active') DEFAULT NULL");
        $this->safeAddField('buildings', 'type', "enum ('sawmill', 'hunting','shop') DEFAULT NULL");
        $this->safeAddKey('buildings', 'KEY', 'fk_field_id', array('field_id'));

        $this->safeCreateTable('goods');
        $this->safeAddField('goods', 'building_id', 'int(11) UNSIGNED NOT NULL');
        $this->safeAddField('goods', 'product_id', 'int(11) UNSIGNED NOT NULL');
        $this->safeAddField('goods', 'count', 'int(11) UNSIGNED NOT NULL');
        $this->safeAddField('goods', 'quality', 'float UNSIGNED NOT NULL');
        $this->safeAddField('goods', 'reserved', 'int(11) UNSIGNED NOT NULL');
        $this->safeAddField('goods', 'price', 'float UNSIGNED DEFAULT 0.01');
        $this->safeAddField('goods', 'export', 'tinyint(1) DEFAULT 0');

        $this->safeCreateTable('products');
        $this->safeAddField('products', 'name', "varchar(32) NOT NULL DEFAULT 'product'");

        DB::query(NULL, "TRUNCATE TABLE products");
        DB::query(Database::INSERT, "INSERT IGNORE INTO products(id, name) VALUE(1, 'meat'), (2, 'wood')");

        $this->safeCreateTable('contracts');
        $this->safeAddField('contracts', 'goods_id', 'int(11) DEFAULT 0');
        $this->safeAddField('contracts', 'dest_id', 'int(11) DEFAULT 0');
        $this->safeAddField('contracts', 'count', 'int(11) DEFAULT 0');
        $this->safeAddKey('contracts', 'KEY', 'fk_goods_id', array('goods_id'));
        $this->safeAddKey('contracts', 'KEY', 'fk_dest_id', array('dest_id'));

    }

    protected function safeCreateTable($tableName, $pkeys = array('`id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT'))
    {
        $key = DB::select('*')->from('information_schema.TABLES')->where('TABLE_SCHEMA', '=', $this->dbname)->where('TABLE_NAME', 'like', $tableName)->execute();
        if ($key->count() == 0)
        {// TODO: add primary keys check
            $pfields = array();
            for ($i = 0; $i < count($pkeys); $i++)
            {
                $pfields[$i] = '`' . $pkeys[$i] . '` int(11) UNSIGNED NOT NULL AUTO_INCREMENT';
                $pkeys[$i] = '`' . $pkeys[$i] . '`';
            }
            DB::query(NULL, 'CREATE Table `' . $tableName . '` (
                        ' . join(',', $pfields) . '
                        PRIMARY KEY  (' . join(',', $pkeys) . '))ENGINE=InnoDB  DEFAULT CHARSET=utf8;')->execute();
        }
    }

    protected function safeAddField($tableName, $fieldName, $fieldType)
    {
        $key = DB::select('*')
            ->from('information_schema.COLUMNS')
            ->where('TABLE_SCHEMA', '=', $this->dbname)
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
            ->where('TABLE_SCHEMA', '=', $this->dbname)
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

    private function safeAddConstraint($tableName, $name, $type, $query)
    {
        $key = DB::select('*')
            ->from('information_schema.TABLE_CONSTRAINTS')
            ->where('TABLE_SCHEMA', '=', $this->dbname)
            ->where('CONSTRAINT_NAME', 'like', $name)
            ->where('CONSTRAINT_TYPE', 'like', $type)
            ->execute();
        if ($key->count() == 0)
        {
            DB::query(NULL, 'ALTER TABLE `' . $tableName . '` CONSTRAINT `' . $name . '` ' . $type . ' ' . $query)->execute();
        }
    }
}