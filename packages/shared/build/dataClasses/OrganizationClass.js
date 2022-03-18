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
exports.RegisterResult = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const util_1 = require("./util");
var RegisterResult;
(function (RegisterResult) {
    RegisterResult[RegisterResult["Successful"] = 0] = "Successful";
    RegisterResult[RegisterResult["EmailTaken"] = 1] = "EmailTaken";
    RegisterResult[RegisterResult["Invalid"] = 2] = "Invalid";
    RegisterResult[RegisterResult["LoginTaken"] = 3] = "LoginTaken";
})(RegisterResult = exports.RegisterResult || (exports.RegisterResult = {}));
class OrganizationClass {
}
__decorate([
    (0, typegoose_1.prop)(Object.assign(Object.assign({}, util_1.email), { required: true })),
    __metadata("design:type", String)
], OrganizationClass.prototype, "email", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], OrganizationClass.prototype, "orgName", void 0);
__decorate([
    (0, typegoose_1.prop)({
        default: () => false
    }),
    __metadata("design:type", Boolean)
], OrganizationClass.prototype, "verified", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], OrganizationClass.prototype, "orgID", void 0);
exports.default = OrganizationClass;
