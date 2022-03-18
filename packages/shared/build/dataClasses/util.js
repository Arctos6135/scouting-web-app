"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.email = void 0;
exports.email = {
    unique: true,
    validate: {
        validator: (s) => /^.+@.+\..{1,5}$/.test(s),
        message: 'value must be email'
    },
    maxlength: 100,
    minlength: 3
};
