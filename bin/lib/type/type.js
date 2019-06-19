"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeNameInfo_1 = require("./typeNameInfo");
class Type {
    constructor(swaggerTypeName) {
        this.swaggerTypeName = swaggerTypeName;
        this.properties = [];
        this.typeNameInfo = typeNameInfo_1.TypeNameInfo.fromSwaggerTypeName(swaggerTypeName);
    }
    get typeName() {
        var name = this.typeNameInfo.typeName;
        return name.charAt(0).toUpperCase() + name.slice(1);
    }
    get isGeneric() {
        return this.typeNameInfo.isGeneric;
    }
    get partialTypeName() {
        return this.typeNameInfo.partialTypeName;
    }
    addProperty(propertyName, propertyType, prop) {
        if (this.isGeneric) {
            propertyType = this.typeNameInfo.replaceWithGenericType(propertyType);
        }
        var name = propertyType.fullTypeName;
        if(prop && prop['$ref'] && prop['$ref'] !== '') {
            name = name.charAt(0).toUpperCase() + name.slice(1);
            this.properties.push({ propertyName, typeName: name });
        } else {
            this.properties.push({ propertyName, typeName: name});
        }
    }
}
exports.Type = Type;
