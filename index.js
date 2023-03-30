"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log('hello');
const userSubscriptionsQuery_1 = require("./mediatr/userSubscriptionsQuery");
const runner_1 = require("./mediatr/runner");
(0, runner_1.registerHandler)(userSubscriptionsQuery_1.UserSubscriptionsQuery, (message) => userSubscriptionsQuery_1.UserSubscriptionsQuery.handle(message, null));
const handler = (message) => userSubscriptionsQuery_1.SaveUserSubscriptionCommand.handle(message, null);
(0, runner_1.registerHandler)(userSubscriptionsQuery_1.UserSubscriptionsQuery, handler);
//registerHandler(SaveUserSubscriptionCommand, (message) => SaveUserSubscriptionCommand.handle(message, null));
async function main() {
    const userResult = await (0, runner_1.run)(new userSubscriptionsQuery_1.UserSubscriptionsQuery("123"));
    const saveResult = await (0, runner_1.run)(new userSubscriptionsQuery_1.SaveUserSubscriptionCommand("123"));
}
main().then(() => console.log("done"));
