"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var userRoutes_1 = require("./Routes/userRoutes");
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/pocts/v1/users', userRoutes_1.default);
exports.default = app;
