"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const process = require("process");
const logger_1 = require("./logger");
const renderer_1 = require("./renderer/renderer");
const deepMerge_1 = require("./utils/deepMerge");
exports.settings = {
    type: {
        typeAliases: {
            Int32: "number",
        },
        generatedTypes: "interface",
        membersOptional: true,
        templateFile: path.join(__dirname, "..", "..", "templates", "typeDefinitions.handlebars"),
        outPutPath: path.join(process.cwd(), "serverTypes", "serverTypes.ts"),
    },
    operations: {
        operationsGroupNameTransformFn,
        operationsNameTransformFn,
        ungroupedOperationsName: "AllOperations",
        templateFile: path.join(__dirname, "..", "..", "templates", "operationsGroup.handlebars"),
        outPutPath: path.join(process.cwd(), "serverTypes", "httpClients"),
        outFileNameTransformFn: operationsGroupFilenameFn,
    },
};
function toPascalCase(string) {
  return string.replace(new RegExp(/[-_]+/, 'g'), ' ').replace(new RegExp(/[^\w\s]/, 'g'), '').replace(
      new RegExp(/\s+(.)(\w+)/, 'g'),
      ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
    ).replace(new RegExp(/\s/, 'g'), '').replace(new RegExp(/\w/), s => s.toUpperCase());
}
function operationsGroupFilenameFn(groupName) {
    return `${groupName}.ts`;
}
function operationsGroupNameTransformFn(operationName, httpVerb, operation) {
    if (operation.tags && operation.tags.length) {
        if(operation.tags[0],indexOf(' ') >= 0) {
            var transformGroupName = toPascalCase(operation.tags[0]);
            return `${transformGroupName}HttpRequest`;
        } else {
            return `${operation.tags[0]}HttpRequest`;
        }        
    }
    else {
        return exports.settings.operations.ungroupedOperationsName;
    }
}
function operationsNameTransformFn(operationName, httpVerb, operation) {
    if(operation.operationId) {
        return operation.operationId.replace(`${operation.tags && operation.tags.length ? operation.tags[0].indexOf(' ') >= 0 ? toPascalCase(operation.tags[0]) : operation.tags[0] : ""}_`, httpVerb);    
    } else {
        var operationData = "";
        operationData += httpVerb.charAt(0).toUpperCase() + httpVerb.slice(1);
        if(operation.tags && operation.tags.length) {
            operationData += toPascalCase(operation.tags[0]);
        }
        return operationData;
    }    
}
function loadSettings(configFile = null, override = {}) {
    if (configFile) {
        logger_1.logger.info(`Loading configuration from ${configFile}`);
    }
    const configPath = path.resolve(process.cwd(), configFile || "swagger-ts-client.config.js");
    let settingsFromFile = {};
    if (fs.existsSync(configPath)) {
        logger_1.logger.info(`Loading configuration from ${configPath}`);
        settingsFromFile = require(configPath);
    }
    else if (configFile) {
        throw new Error(`could not find config file ${configPath}`);
    }
    deepMerge_1.deepMerge(exports.settings, settingsFromFile, override);
    // overrides
    if (override.swaggerFile && exports.settings.swaggerProvider) {
        exports.settings.swaggerProvider = null;
    }
    if (override.swaggerProvider && exports.settings.swaggerFile) {
        exports.settings.swaggerFile = null;
    }
    renderer_1.registerHandleBarsHelpers(exports.settings);
    return exports.settings;
}
exports.loadSettings = loadSettings;
