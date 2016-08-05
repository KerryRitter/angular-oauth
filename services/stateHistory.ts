/// <reference path="../typings.d.ts" />

class StateHistory {
	public static $inject = ["$rootScope", "$state", "$q"];

	private _history = [];
	private _isHistoryLocked = false;

	public constructor(
		private _rootScopeService: ng.IRootScopeService,
		private _stateService: ng.ui.IStateService,
		private _qService: ng.IQService
	) {
	}

	public setLastState(st) {
		this._history.unshift(st);
	}

	public getLastState() {
		return this._history.length > 0 ? this._history[0] : false;
	}

	public hasLastState() {
		var lastSt = this.getLastState();
		
		if(lastSt && lastSt.state && lastSt.state.name === '') {
			this.clear();
			lastSt = this.getLastState();
		}

		return (lastSt && lastSt.state && lastSt.state.name !== '');
	}

	public lockHistory() {
		this._isHistoryLocked = true;
	}

	public unlockHistory() {
		this._isHistoryLocked = false;
	}

	public isHistoryLocked() {
		return this._isHistoryLocked;
	}

	public getItem(stateName) {
		var state;
		angular.forEach(this._history, function (item) {
			if(item.state.name === stateName) {
				state = item;
			}
		});
		return state;
	}

	public removeItem(stateName) {
		var item = this.getItem(stateName);
		
		if(!item) {
			return false;
		}

		var index = this.getItemIndex(item);

		this._history.splice(index, 1);

		return true;
	}

	public removeLastItem() {
		var lastItem = this.getLastState();

		return this.removeItem(lastItem.state.name);
	}

	public back(defaultStateParams) {
		if(!this.isHistoryLocked()) {
			this.lockHistory();
		}

		var lastState = this.getLastState();
		
		if (lastState) {
			return this._stateService.go(lastState.state.name, defaultStateParams ? defaultStateParams : lastState.params).then(() => {
				this._history.splice(this._history.indexOf(lastState), 1);

				this.unlockHistory();
			});
		} 
	}
	
	public clear() {
		this._history = [];
	}

	public getHistory() {
		return this._history;
	}

	public getItemIndex (item) {
		return this._history.indexOf(item);
	}

	public setupRunWatcher() {
		this._rootScopeService.$on("$stateChangeSuccess", (event, toState, toParams, fromState, fromParams) => {
			if (this.isHistoryLocked()) {
				return this.unlockHistory();
			}

			if (!fromState.abstract) {
				this.setLastState({
					state: fromState,
					params: fromParams
				});
			}
		});
	}
}