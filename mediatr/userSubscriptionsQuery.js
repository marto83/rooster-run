"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveUserSubscriptionCommand = exports.UserSubscriptionsQuery = void 0;
const runner_1 = require("./runner");
const Either_1 = require("fp-ts/lib/Either");
class UserSubscriptionsQuery extends runner_1.Query {
    userId;
    constructor(userId) {
        super();
        this.userId = userId;
    }
    static async handle(message, repo) {
        // Go to the DB 
        // Get the user subscriptions
        console.log("returning user subs");
        return (0, Either_1.right)([]);
    }
}
__decorate([
    runner_1.addLogging
], UserSubscriptionsQuery, "handle", null);
exports.UserSubscriptionsQuery = UserSubscriptionsQuery;
class SaveUserSubscriptionCommand extends runner_1.Query {
    userId;
    constructor(userId) {
        super();
        this.userId = userId;
    }
    static async handle(message, repo) {
        if (message.userId === "123") {
            return (0, Either_1.left)(new Error("User not found"));
        }
        return (0, Either_1.right)(undefined);
    }
}
__decorate([
    runner_1.addLogging
], SaveUserSubscriptionCommand, "handle", null);
exports.SaveUserSubscriptionCommand = SaveUserSubscriptionCommand;
