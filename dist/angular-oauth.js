var OAuthHttpService = (function () {
    function OAuthHttpService(_httpService, _windowService, _qService, _config) {
        this._httpService = _httpService;
        this._windowService = _windowService;
        this._qService = _qService;
        this._config = _config;
    }
    OAuthHttpService.prototype.register = function (email, password) {
        var _this = this;
        return this._qService(function (resolve, reject) {
            return _this._httpService({
                method: "POST",
                url: _this._config.registerUrl,
                data: {
                    email: email,
                    password: password,
                }
            })
                .success(function (data, status, headers, config) {
                if (data.succeeded) {
                    resolve({
                        success: true,
                        messages: null
                    });
                }
                else {
                    var message = "There was an error during registration";
                    try {
                        message = data.errors[0].description;
                    }
                    catch (ex) {
                        console.log(ex);
                    }
                    reject({
                        success: false,
                        messages: [message]
                    });
                }
            }).error(function (data, status, headers, config) {
                reject({
                    success: false,
                    messages: ["There was a server error during registration"]
                });
            });
        });
    };
    OAuthHttpService.prototype.login = function (email, password) {
        var _this = this;
        return this._qService(function (resolve, reject) {
            return _this._httpService({
                method: "POST",
                url: _this._config.tokenUrl,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: {
                    username: email,
                    password: password,
                    grant_type: "password",
                    scope: "profile email"
                },
                transformRequest: _this.transformToQueryString
            })
                .success(function (data, status, headers, config) {
                if (data.error) {
                    resolve({
                        success: false,
                        messages: [data.error_description]
                    });
                }
                else {
                    _this._windowService.localStorage.setItem("token", JSON.stringify(data));
                    resolve({
                        success: true,
                        messages: null
                    });
                }
            }).error(function (data, status, headers, config) {
                reject(data);
            });
        });
    };
    OAuthHttpService.prototype.get = function (url, config) {
        return this._httpService.get(url, this.addTokenHeader(config));
    };
    OAuthHttpService.prototype.delete = function (url, config) {
        return this._httpService.delete(url, this.addTokenHeader(config));
    };
    OAuthHttpService.prototype.head = function (url, config) {
        return this._httpService.head(url, this.addTokenHeader(config));
    };
    OAuthHttpService.prototype.jsonp = function (url, config) {
        return this._httpService.jsonp(url, this.addTokenHeader(config));
    };
    OAuthHttpService.prototype.post = function (url, data, config) {
        return this._httpService.post(url, data, this.addTokenHeader(config));
    };
    OAuthHttpService.prototype.put = function (url, data, config) {
        return this._httpService.put(url, data, this.addTokenHeader(config));
    };
    OAuthHttpService.prototype.patch = function (url, data, config) {
        return this._httpService.patch(url, data, this.addTokenHeader(config));
    };
    Object.defineProperty(OAuthHttpService.prototype, "token", {
        get: function () {
            var tokenPayloadJson = this._windowService.localStorage.getItem("token");
            if (!tokenPayloadJson) {
                return null;
            }
            try {
                var token = JSON.parse(tokenPayloadJson);
                return token && token.access_token ? token.access_token : null;
            }
            catch (ex) {
                return null;
            }
        },
        enumerable: true,
        configurable: true
    });
    OAuthHttpService.prototype.clearToken = function () {
        this._windowService.localStorage.removeItem("token");
    };
    OAuthHttpService.prototype.addTokenHeader = function (config) {
        if (!config) {
            config = {};
        }
        if (!config.headers) {
            config.headers = {};
        }
        config.headers["Authorization"] = "Bearer " + this.token;
        return config;
    };
    OAuthHttpService.prototype.transformToQueryString = function (obj) {
        var str = [];
        for (var p in obj) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
        return str.join("&");
    };
    OAuthHttpService.$inject = ["$http", "$window", "$q", "openIddictConfig"];
    return OAuthHttpService;
}());
/// <reference path="typings.d.ts" />
var AngularOAuth = angular.module("openIddict", []);
AngularOAuth.value("openIddictConfig", {});
AngularOAuth.service("oauthHttpService", OAuthHttpService);
