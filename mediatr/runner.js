"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.registerHandler = exports.addLogging = exports.Command = exports.Query = void 0;
class Query {
}
exports.Query = Query;
class Command {
}
exports.Command = Command;
function addLogging(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        console.log(`Calling ${propertyKey} with arguments: `, args);
        const result = originalMethod.apply(this, args);
        console.log(`Result of ${propertyKey}: `, result);
        return result;
    };
    return descriptor;
}
exports.addLogging = addLogging;
const handlers = new Map();
function registerHandler(type, handler) {
    handlers.set(type, handler);
}
exports.registerHandler = registerHandler;
async function run(message) {
    const handler = handlers.get(message.constructor);
    if (!handler) {
        throw new Error(`No handler found for message ${message.constructor.name}`);
    }
    return await handler(message);
}
exports.run = run;
