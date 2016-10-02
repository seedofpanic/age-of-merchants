import ModalController from "./controller.ts";

require('./style.less');
const template = require('./template.html');

const modalsComponent = {
    controller: ModalController,
    template: template,
    bindings: {
        template: '<'
    }
};

export default angular.module('ModalModule', [])
    .component('modal', modalsComponent);