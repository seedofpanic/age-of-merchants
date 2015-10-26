var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  console.log('buildings');
  createBuildings();
  function createBuildings() {
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
        notNull: true
      },
      'field_id': {
        type: 'int',
        unsigned: true,
        length: 10,
        notNull: true
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
  }

  function createContracts(err) {
    if (err) {
      console.log(err);
    }
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
        notNull: true
      },
      'dest_id': {
        type: 'int',
        unsigned: true,
        length: 10,
        notNull: true
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
    if (err) {
      console.log(err);
    }
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
            notNull: true
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
          'price': {
            type: 'decimal',
            unsigned: true,
            notNull: true,
            length: '10,2'
          },
          'quality': {
            type: 'decimal',
            unsigned: true,
            notNull: true,
            length: '10,2'
          },
          'export': {
            type: 'smallint',
            unsigned: true,
            notNull: true,
            length: 1
          },
          'reserved': {
            type: 'smallint',
            unsigned: true,
            notNull: true,
            length: 1
          }
        }, createMapFields
    );
  }
  function createMapFields(err) {
    if (err) {
      console.log(err);
    }
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
            notNull: true
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
    if (err) {
      console.log(err);
    }
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
    if (err) {
      console.log(err);
    }
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
            notNull: true
          },
          'name': {
            type: 'string',
            notNull: true,
            length: 64
          },
          'gold': {
            type: 'decimal',
            unsigned: true,
            notNull: true,
            length: '10,2'
          }
        }, createUsers
    );
  }
  function createUsers(err) {
    if (err) {
      console.log(err);
    }
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
        addKeys
    );
  }

  function addKeys (err) {
    db.addForeignKey( 'buildings', 'profiles', 'building_profile_id_fk',
        { profile_id: 'id'},
        {}, function () {
          db.addForeignKey( 'buildings', 'map_fields', 'building_field_id_fk',
              { field_id: 'id'},
              {}, function () {
                db.addForeignKey( 'contracts', 'goods', 'contracts_goods_id_fk',
                    { goods_id: 'id'},
                    {}, function () {
                      db.addForeignKey( 'contracts', 'buildings', 'contracts_dest_id_fk',
                          { dest_id: 'id'},
                          {}, function () {
                            db.addForeignKey( 'goods', 'buildings', 'goods_building_id_fk',
                                { building_id: 'id'},
                                {}, function () {
                                  db.addForeignKey( 'map_fields', 'map_regions', 'map_fields_region_id_fk',
                                      { region_id: 'id'},
                                      {}, function () {
                                        db.addForeignKey( 'profiles', 'users', 'profile_user_id_fk',
                                            { user_id: 'id'},
                                            {}, callback
                                        );
                                      }
                                  );
                                }
                            );
                          }
                      );
                    }
                );
              }
          );
        }
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
