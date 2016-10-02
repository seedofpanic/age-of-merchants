import ISCEService = angular.ISCEService;
import ITemplateCacheService = angular.ITemplateCacheService;
export class Modal {

    constructor(
        public template: string,
        private modalsService: ModalsService
    ) {
    }

    close() {
        this.modalsService.close(this);
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
        const modal = new Modal(modalName, this);
        this.modals.push(modal);
        return modal;
    }

    close(modal: Modal) {
        _.remove(this.modals, modal);
    }
}

export default angular.module('ModalsServiceModule', [])
.service('ModalsService', ModalsService);