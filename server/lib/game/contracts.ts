var models = require('./../../models');

var final_cb;

function final() {
    setTimeout(final_cb, 0);
}

function contractsUpdate(cb) {
    final_cb = cb;
    models.contracts.findAll({include: [
        {model: models.buildings, attributes: ['id'], include: {model: models.profiles, attributes: ['user_id']}},
        {model: models.products, include: {model: models.buildings, attributes: ['id'], include: {model: models.profiles, attributes: ['user_id']}}}
    ], where: {done: false}}).then(function (contracts){
        contractsWrapper(contracts);
    });
}

var contracts;
var contract;
var Ic;

function contractsWrapper(data) {
    contracts = data;
    Ic = contracts.length - 1;
    contractsIter();
}

function contractsIter() {
    if (Ic == -1) {
        final();
        return;
    }
    contract = contracts[Ic];
    Ic--;
    switch (contract.type) {
        case 1:
            var count;
            var product = contract.product;
            if (contract.building.profile.user_id == product.building.profile.user_id) { // If product belongs to user that creates contract, there will be no restrictions
                if (product.count > contract.count) {
                    count = contract.count;
                    product.count -= count;
                } else {
                    count = product.count;
                    product.count = 0;
                }
            } else {
                if (product.export_count > contract.count) {
                    count = contract.count;
                    product.export_count -= count;
                } else {
                    count = product.export_count;
                    product.export_count = 0;
                }
            }
            product.take(count, function (taken) {
                models.buildings.findById(contract.dest_id).then(function (building) {
                    building.addProducts(product.product_type, taken.count, taken.quality, function () {
                        contract.done = true;
                        contract.save().then(function () {
                            contractsIter();
                        });
                    });
                });
            });
            break;
    }
}

module.exports = contractsUpdate;