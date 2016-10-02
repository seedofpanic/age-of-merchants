import ModalModule from './modal/component.ts';
import ModalsController from "./controller.ts";
import ModalsServiceModule from './service.ts';

require('./style.less');
const template = require('./template.html');

const modalsComponent = {
    controller: ModalsController,
    template: template,
    bindings: {}
};

export default angular.module('ModalsModule', [
    ModalModule.name,
    ModalsServiceModule.name
])
.component('modals', modalsComponent);