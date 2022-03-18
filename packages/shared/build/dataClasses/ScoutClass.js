"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginResult = void 0;
const typegoose_1 = require("@typegoose/typegoose");
var LoginResult;
(function (LoginResult) {
    LoginResult[LoginResult["Successful"] = 0] = "Successful";
    LoginResult[LoginResult["WrongPassword"] = 1] = "WrongPassword";
    LoginResult[LoginResult["NoUser"] = 2] = "NoUser";
    LoginResult[LoginResult["Unverified"] = 3] = "Unverified";
    LoginResult[LoginResult["NoOrg"] = 4] = "NoOrg";
})(LoginResult = exports.LoginResult || (exports.LoginResult = {}));
class ScoutClass {
}
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], ScoutClass.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], ScoutClass.prototype, "login", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], ScoutClass.prototype, "passwordHash", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], ScoutClass.prototype, "org", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Boolean)
], ScoutClass.prototype, "admin", void 0);
exports.default = ScoutClass;
