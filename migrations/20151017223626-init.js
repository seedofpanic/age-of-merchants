var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  console.log('buildings');
  db.createTable('buildings', {
        'id': {
          type: 'int',
          unsigned: true,
          notNull: true,
          primaryKey: true,
          autoIncrement: true,
          length: 10
        },
        'profile_id': {
          type: 'int',
          unsigned: true,
          length: 10,
          notNull: true,
          foreignKey: {
            name: 'building_profile_id_fk',
            table: 'profiles',
            mapping: 'id',
            rules: {}
          }
        },
        'field_id': {
          type: 'int',
          unsigned: true,
          length: 10,
          notNull: true,
          foreignKey: {
            name: 'building_field_id_fk',
            table: 'map_fields',
            mapping: 'id',
            rules: {}
          }
        },
        'name': {
          type: 'string',
          notNull: true,
          length: '64'
        },
        'buildtime': {
          type: 'smallint',
          notNull: true,
          length: 3
        },
        'status': {
          type: 'smallint',
          notNull: true,
          length: 3
        },
        'type': {
          type: 'smallint',
          notNull: true,
          length: 3
        }
      }, createContracts);


  function createContracts(err) {
    console.log(err);
    console.log('contracts');
    db.createTable('contracts', {
      'id': {
        type: 'int',
        unsigned: true,
        notNull: true,
        primaryKey: true,
        autoIncrement: true,
        length: 10
      },
      'goods_id': {
        type: 'int',
        unsigned: true,
        length: 10,
        notNull: true,
        foreignKey: {
          name: 'contracts_goods_id_fk',
          table: 'goods',
          mapping: 'id',
          rules: {}
        }
      },
      'dest_id': {
        type: 'int',
        unsigned: true,
        length: 10,
        notNull: true,
        foreignKey: {
          name: 'contracts_dest_id_fk',
          table: 'buildings',
          mapping: 'id',
          rules: {}
        }
      },
      'count': {
        type: 'int',
        unsigned: true,
        notNull: true,
        length: 10
      }
    }, createGoods);
  }
  function createGoods(err) {
    console.log(err);
    console.log('goods');
    db.createTable('goods', {
          'id': {
            type: 'int',
            unsigned: true,
            notNull: true,
            primaryKey: true,
            autoIncrement: true,
            length: 10
          },
          'building_id': {
            type: 'int',
            unsigned: true,
            length: 10,
            notNull: true,
            foreignKey: {
              name: 'goods_building_id_fk',
              table: 'buildings',
              mapping: 'id',
              rules: {}
            }
          },
          'product_type': {
            type: 'int',
            unsigned: true,
            notNull: true,
            length: 10
          },
          'count': {
            type: 'int',
            unsigned: true,
            notNull: true,
            length: 10
          },
          'quality': {
            type: 'decimal',
            unsigned: true,
            notNull: true
          },
          'export': {
            type: 'smallint',
            unsigned: true,
            notNull: true,
            length: 1
          }
        }, createMapFields
    );
  }
  function createMapFields(err) {
    console.log(err);
    console.log('map_fields');
    db.createTable('map_fields', {
          'id': {
            type: 'int',
            unsigned: true,
            notNull: true,
            primaryKey: true,
            autoIncrement: true,
            length: 10
          },
          'region_id': {
            type: 'int',
            unsigned: true,
            length: 10,
            notNull: true,
            foreignKey: {
              name: 'map_fields_region_id_fk',
              table: 'map_regions',
              mapping: 'id',
              rules: {}
            }
          },
          'x': {
            type: 'smallint',
            unsigned: true,
            notNull: true,
            length: 6
          },
          'y': {
            type: 'smallint',
            unsigned: true,
            notNull: true,
            length: 6
          }
        }, createMapRegions
    );
  }
  function createMapRegions(err) {
    console.log(err);
    console.log('map_regions');
    db.createTable('map_regions', {
      'id': {
        type: 'int',
        unsigned: true,
        notNull: true,
        primaryKey: true,
        autoIncrement: true,
        length: 10
      },
      'name': {
        type: 'string',
        notNull: true,
        length: 64
      },
      'x': {
        type: 'smallint',
        unsigned: false,
        notNull: true,
        length: 6
      },
      'y': {
        type: 'smallint',
        unsigned: false,
        notNull: true,
        length: 6
      }
    }, createProfiles);
  }
  function createProfiles(err) {
    console.log(err);
    console.log('profiles');
    db.createTable('profiles', {
          'id': {
            type: 'int',
            unsigned: true,
            notNull: true,
            primaryKey: true,
            autoIncrement: true,
            length: 10
          },
          'user_id': {
            type: 'int',
            unsigned: true,
            length: 10,
            notNull: true,
            foreignKey: {
              name: 'profile_user_id_fk',
              table: 'users',
              mapping: 'id',
              rules: {}
            }
          },
          'name': {
            type: 'string',
            notNull: true,
            length: 64
          },
          'gold': {
            type: 'decimal',
            unsigned: true,
            notNull: true
          }
        }, createUsers
    );
  }
  function createUsers(err) {
    console.log(err);
    console.log('users');
    db.createTable('users', {
          'id': {
            type: 'int',
            unsigned: true,
            notNull: true,
            primaryKey: true,
            autoIncrement: true,
            length: 10
          },
          'email': {
            type: 'string',
            notNull: true,
            length: 128
          },
          'username': {
            type: 'string',
            notNull: true,
            length: 32
          },
          'password': {
            type: 'string',
            notNull: true,
            length: 64
          },
          'logins': {
            type: 'int',
            unsigned: true,
            notNull: true,
            length: 10
          },
          'last_login': {
            type: 'int',
            unsigned: true,
            notNull: true,
            length: 10
          }
        },
        callback
    );
  }
};

exports.down = function(db, callback) {
  db.dropTable('users', {ifExists: true}, dropProfiles);
  function dropProfiles () {
    db.dropTable('profiles', {ifExists: true}, dropMapRegions);
  }
  function dropMapRegions () {
    db.dropTable('map_regions', {ifExists: true}, dropMapFields);
  }
  function dropMapFields () {
    db.dropTable('map_fields', {ifExists: true}, dropGoods);
  }
  function dropGoods () {
    db.dropTable('goods', {ifExists: true}, dropContracts);
  }
  function dropContracts () {
    db.dropTable('contracts', {ifExists: true}, dropBuildings);
  }
  function dropBuildings () {
    db.dropTable('buildings', {ifExists: true}, callback);
  }
};
