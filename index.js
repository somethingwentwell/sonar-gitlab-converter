#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs/yargs"));
const axios_1 = __importDefault(require("axios"));
const converter_1 = require("./src/converter");
const fs_1 = __importDefault(require("fs"));
const parser = (0, yargs_1.default)(process.argv.slice(2)).options({
    host: { type: 'string', default: 'https://sonarqube.com' },
    token: { type: 'string', default: '' },
    project: { type: 'string', default: '' }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    const argv = yield parser.argv;
    if (argv.token === '' || argv.project === '') {
        console.log('Please provide a token and project name');
        process.exit(1);
    }
    let authToken = Buffer.from(argv.token + ':').toString('base64');
    console.log(authToken);
    let config = {
        method: 'get',
        url: `${argv.host}/api/server/version`,
        headers: {
            'Authorization': `Basic ${authToken}`
        }
    };
    let response = yield (0, axios_1.default)(config);
    const version = response.data;
    console.log(`Version: ${response.data}`);
    config = {
        method: 'get',
        url: `${argv.host}/api/issues/search?componentKeys=${argv.project}`,
        headers: {
            'Authorization': `Basic ${authToken}`,
        }
    };
    try {
        response = yield (0, axios_1.default)(config);
        // console.log(response.data);
        let sonarIssues = yield response.data.issues;
        fs_1.default.writeFile('gl-sast-report.json', JSON.stringify((0, converter_1.convert)(sonarIssues, version)), function (err) {
            if (err)
                return console.log(err);
            console.log('Saved!');
        });
    }
    catch (error) {
        console.log(error);
    }
}))();
