import {ModalsService} from "./service";

export default class ModalsController {

    static $inject = ['ModalsService'];

    public modals;

    constructor(
        public ModalsService: ModalsService
    ) {
        this.modals = ModalsService.modals;
    }
}