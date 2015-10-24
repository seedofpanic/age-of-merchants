module.exports = function (db, cb) {
    db.define('goods', {
        id: {type: 'serial', key: true},
        product_type: {type: 'integer', defaultValue: 0},
        count: {type: 'integer', defaultValue: 0},
        quality: {type: 'number', defaultValue: 0},
        reserved: {type: 'integer', defaultValue: 0},
        price: {type: 'number', defaultValue: 0},
        'export': {type: 'integer', defaultValue: 0},
        'export_count': {type: 'integer', defaultValue: 0}
    },{
        methods: {
            add: function (count, quality) {
                var goods = this;
                var old_count = goods.count;
                var old_quality = goods.quality;
                goods.quality = (old_quality * old_count + quality * count) / (old_count + count);
                goods.count = (old_count + count);
                goods.save();
            },
            take: function(count, cb) {
                var taken = {};
                taken.quality = this.quality;
                if (this.count >= count) {
                    this.count -= count;
                    taken.count = count;
                    this.save()
                } else {
                    taken.count = this.count;
                    this.remove()
                }
                if (cb) {cb(taken)}
            }
        }
    });

    return cb();
};