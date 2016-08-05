/// <reference path="typings.d.ts" />

const AngularOAuth = angular.module("openIddict", []);

AngularOAuth.value("openIddictConfig", {} as oauth.IOAuthConfig);
AngularOAuth.service("oauthHttpService", OAuthHttpService);