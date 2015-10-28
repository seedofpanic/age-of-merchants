exports.up = function(db, dataType) {
    console.log('buildings');
    db.createTable('buildings', {
      'id': {
        type: dataType.BIGINT,
        unsigned: true,
        notNull: true,
        primaryKey: true,
        autoIncrement: true,
      },
      'name': {
        type: dataType.STRING,
        notNull: true
      },
      'buildtime': {
        type: dataType.INTEGER,
        notNull: true
      },
      'status': {
        type: dataType.INTEGER,
        notNull: true
      },
      'type': {
        type: dataType.INTEGER,
        notNull: true
      },
        'createdAt': {
            type: dataType.DATE
        },
        'updatedAt': {
            type: dataType.DATE
        }
    });

    console.log('contracts');
    db.createTable('contracts', {
      'id': {
        type: dataType.BIGINT,
        unsigned: true,
        notNull: true,
        primaryKey: true,
        autoIncrement: true
      },
      'count': {
        type: dataType.BIGINT,
        unsigned: true,
        notNull: true,
        length: 10
      },
        'createdAt': {
            type: dataType.DATE
        },
        'updatedAt': {
            type: dataType.DATE
        }
    });
    console.log('products');
    db.createTable('products', {
          'id': {
            type: dataType.BIGINT,
            unsigned: true,
            notNull: true,
            primaryKey: true,
            autoIncrement: true
          },
          'product_type': {
            type: dataType.INTEGER,
            unsigned: true,
            notNull: true
          },
          'count': {
            type: dataType.BIGINT,
            unsigned: true,
            notNull: true
          },
          'price': {
            type: dataType.DECIMAL(10,2),
            unsigned: true,
            notNull: true
          },
          'quality': {
            type: dataType.DECIMAL(10,2),
            unsigned: true,
            notNull: true
          },
          'export': {
            type: dataType.INTEGER,
            unsigned: true,
            notNull: true
          },
          'reserved': {
            type: dataType.BIGINT,
            unsigned: true,
            notNull: true
          },
            'createdAt': {
                type: dataType.DATE
            },
            'updatedAt': {
                type: dataType.DATE
            }
        }
    );
    console.log('fields');
    db.createTable('fields', {
          'id': {
            type: dataType.BIGINT,
            unsigned: true,
            notNull: true,
            primaryKey: true,
            autoIncrement: true
          },
          'x': {
            type: dataType.INTEGER,
            unsigned: true,
            notNull: true
          },
          'y': {
            type: dataType.INTEGER,
            unsigned: true,
            notNull: true
          },
            'createdAt': {
                type: dataType.DATE
            },
            'updatedAt': {
                type: dataType.DATE
            }
        }
    );
    console.log('regions');
    db.createTable('regions', {
      'id': {
        type: dataType.BIGINT,
        unsigned: true,
        notNull: true,
        primaryKey: true,
        autoIncrement: true
      },
      'name': {
        type: dataType.STRING,
        notNull: true
      },
      'x': {
        type: dataType.INTEGER,
        unsigned: false,
        notNull: true
      },
      'y': {
        type: dataType.INTEGER,
        unsigned: false,
        notNull: true
      },
        'createdAt': {
            type: dataType.DATE
        },
        'updatedAt': {
            type: dataType.DATE
        }
    });
    console.log('profiles');
    db.createTable('profiles', {
          'id': {
            type: dataType.BIGINT,
            unsigned: true,
            notNull: true,
            primaryKey: true,
            autoIncrement: true
          },
          'name': {
            type: dataType.STRING,
            notNull: true
          },
          'gold': {
            type: dataType.DECIMAL(10,2),
            unsigned: true,
            notNull: true
          },
            'createdAt': {
                type: dataType.DATE
            },
            'updatedAt': {
                type: dataType.DATE
            }
        }
    );
    console.log('users');
    db.createTable('users', {
          'id': {
            type: dataType.BIGINT,
            unsigned: true,
            notNull: true,
            primaryKey: true,
            autoIncrement: true
          },
          'email': {
            type: dataType.STRING,
            notNull: true
          },
          'username': {
            type: dataType.STRING,
            notNull: true
          },
          'password': {
            type: dataType.STRING,
            notNull: true
          },
          'logins': {
            type: dataType.INTEGER,
            unsigned: true,
            notNull: true
          },
          'last_login': {
            type: dataType.BIGINT,
            unsigned: true,
            notNull: true
          },
            'createdAt': {
                type: dataType.DATE
            },
            'updatedAt': {
                type: dataType.DATE
            }
        }
    );

    db.addColumn( 'buildings', 'profile_id', {
        type: dataType.BIGINT,
        unsigned: true,
        references: {
            model: "profiles",
            key: "id"
        }
    });
    db.addColumn( 'buildings', 'field_id', {
        type: dataType.BIGINT,
        unsigned: true,
        references: {
            model: "fields",
            key: "id"
        }
    });
    db.addColumn( 'contracts', 'product_id', {
        type: dataType.BIGINT,
        unsigned: true,
        references: {
            model: "products",
            key: "id"
        }
    });
    db.addColumn( 'contracts', 'dest_id', {
        type: dataType.BIGINT,
        unsigned: true,
        references: {
            model: "buildings",
            key: "id"
        }
    });
    db.addColumn( 'products', 'building_id', {
        type: dataType.BIGINT,
        unsigned: true,
        references: {
            model: "buildings",
            key: "id"
        }
    });
    db.addColumn( 'fields', 'region_id', {
        type: dataType.BIGINT,
        unsigned: true,
        references: {
            model: "regions",
            key: "id"
        }
    });
    db.addColumn( 'profiles', 'user_id', {
        type: dataType.BIGINT,
        unsigned: true,
        references: {
            model: "users",
            key: "id"
        }
    });

};

exports.down = function(db) {
    db.dropTable('buildings')
    db.dropTable('contracts')
    db.dropTable('products')
    db.dropTable('fields')
    db.dropTable('regions')
    db.dropTable('profiles')
    db.dropTable('users')
};
