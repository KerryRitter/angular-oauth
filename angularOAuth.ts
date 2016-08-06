/// <reference path="typings.d.ts" />

angular.module("angular-oauth", [])
    .value("oauthConfig", {} as oauth.IOAuthConfig)
    .service("oauthHttpService", OAuthHttpService);