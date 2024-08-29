"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config({ path: './config.env' });
const DB = process.env.CONN_STR;
mongoose_1.default.connect(DB)
    .then(() => {
    console.log('DB CONNECTION SUCCESSFUL');
    const port = process.env.PORT || 3000;
    app_1.default.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
})
    .catch(error => {
    console.error('Error connecting to MongoDB:', error);
});
