exports.up = function(db, dataType, done) {
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
    }).then(function (){
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
        }).then(function (){
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
            ).then(function () {
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
                    ).then(function (){
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
                            }).then(function () {
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
                                ).then(function () {
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
                                        ).then(function (){
                                                var pendings = 7;
                                                db.addColumn( 'buildings', 'profile_id', {
                                                    type: dataType.BIGINT,
                                                    unsigned: true,
                                                    references: {
                                                        model: "profiles",
                                                        key: "id"
                                                    }
                                                }).then(function () {
                                                    pendings--;
                                                    if (pendings == 0) {
                                                        done();
                                                    }
                                                });
                                                db.addColumn( 'buildings', 'field_id', {
                                                    type: dataType.BIGINT,
                                                    unsigned: true,
                                                    references: {
                                                        model: "fields",
                                                        key: "id"
                                                    }
                                                }).then(function () {
                                                    pendings--;
                                                    if (pendings == 0) {
                                                        done();
                                                    }
                                                });
                                                db.addColumn( 'contracts', 'product_id', {
                                                    type: dataType.BIGINT,
                                                    unsigned: true,
                                                    references: {
                                                        model: "products",
                                                        key: "id"
                                                    }
                                                }).then(function () {
                                                    pendings--;
                                                    if (pendings == 0) {
                                                        done();
                                                    }
                                                });
                                                db.addColumn( 'contracts', 'dest_id', {
                                                    type: dataType.BIGINT,
                                                    unsigned: true,
                                                    references: {
                                                        model: "buildings",
                                                        key: "id"
                                                    }
                                                }).then(function () {
                                                    pendings--;
                                                    if (pendings == 0) {
                                                        done();
                                                    }
                                                });
                                                db.addColumn( 'products', 'building_id', {
                                                    type: dataType.BIGINT,
                                                    unsigned: true,
                                                    references: {
                                                        model: "buildings",
                                                        key: "id"
                                                    }
                                                }).then(function () {
                                                    pendings--;
                                                    if (pendings == 0) {
                                                        done();
                                                    }
                                                });
                                                db.addColumn( 'fields', 'region_id', {
                                                    type: dataType.BIGINT,
                                                    unsigned: true,
                                                    references: {
                                                        model: "regions",
                                                        key: "id"
                                                    }
                                                }).then(function () {
                                                    pendings--;
                                                    if (pendings == 0) {
                                                        done();
                                                    }
                                                });
                                                db.addColumn( 'profiles', 'user_id', {
                                                    type: dataType.BIGINT,
                                                    unsigned: true,
                                                    references: {
                                                        model: "users",
                                                        key: "id"
                                                    }
                                                }).then(function () {
                                                    pendings--;
                                                    if (pendings == 0) {
                                                        done();
                                                    }
                                                });
                                            })
                                    });
                            });
                        });
                });
        });
    });
};

exports.down = function(db, dataType, done) {
    var pendings = 7
    db.dropTable('buildings').then(function () {
        pendings--;
        if (pendings == 0) {
            done();
        }
    });
    db.dropTable('contracts').then(function () {
        pendings--;
        if (pendings == 0) {
            done();
        }
    });
    db.dropTable('products').then(function () {
        pendings--;
        if (pendings == 0) {
            done();
        }
    });
    db.dropTable('fields').then(function () {
        pendings--;
        if (pendings == 0) {
            done();
        }
    });
    db.dropTable('regions').then(function () {
        pendings--;
        if (pendings == 0) {
            done();
        }
    });
    db.dropTable('profiles').then(function () {
        pendings--;
        if (pendings == 0) {
            done();
        }
    });
    db.dropTable('users').then(function () {
        pendings--;
        if (pendings == 0) {
            done();
        }
    });
};
