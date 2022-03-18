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
exports.Section = exports.Group = exports.Row = void 0;
const typegoose_1 = require("@typegoose/typegoose");
class Row {
    constructor() {
        this.type = 'row';
    }
}
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Row.prototype, "type", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Array)
], Row.prototype, "components", void 0);
exports.Row = Row;
class Group {
    constructor() {
        this.type = 'group';
    }
}
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Group.prototype, "type", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Group.prototype, "label", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Object)
], Group.prototype, "component", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Group.prototype, "description", void 0);
exports.Group = Group;
class Section {
    constructor() {
        this.type = 'section';
    }
}
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Section.prototype, "type", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Section.prototype, "header", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Array)
], Section.prototype, "groups", void 0);
exports.Section = Section;
class FormClass {
}
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Array)
], FormClass.prototype, "sections", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], FormClass.prototype, "ownerOrg", void 0);
__decorate([
    (0, typegoose_1.prop)({
        unique: true,
        required: true
    }),
    __metadata("design:type", String)
], FormClass.prototype, "id", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], FormClass.prototype, "name", void 0);
exports.default = FormClass;
