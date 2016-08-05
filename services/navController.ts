/// <reference path="../typings.d.ts" />

class NavController {
    public static $inject = ["$log", "$state", "stateHistory"];

    public constructor(
        private _logService: ng.ILogService,
        public state: ng.ui.IStateService,
        private _stateHistory: StateHistory
    ) {
    }

    public push(page: IPage|string, params?: any) {
        this.state.go(angular.isString(page) ? page : (page as IPage).__stateName, params);
    }

    public pop(params?: any) {
        this._stateHistory.back(params);
    }
}