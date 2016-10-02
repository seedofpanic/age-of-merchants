import ISCEService = angular.ISCEService;
import ITemplateCacheService = angular.ITemplateCacheService;
export class Modal {

    constructor(
        public template: string
    ) {

    }
}

export class ModalsService {

    static $inject = ['$sce', '$templateCache'];

    public modals: Modal[] = [];

    constructor(
        public $sce: ISCEService,
        public $templateCache: ITemplateCacheService
    ) {

    }

    show(template: string) {
        const modalName = 'modals-cache-' + (this.modals.length + 1);
        this.$templateCache.put(modalName, template);
        const modal = new Modal(modalName);
        this.modals.push(modal);
        return modal;
    }
}

export default angular.module('ModalsServiceModule', [])
.service('ModalsService', ModalsService);