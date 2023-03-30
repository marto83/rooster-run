console.log('hello')
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/function';
import { Either, Do,  } from 'fp-ts/lib/Either'
import { UserSubscription } from './mediatr/userSubscriptionsQuery';

import { UserSubscriptionsQuery, SaveUserSubscriptionCommand } from "./mediatr/userSubscriptionsQuery";
import { IMessage, IQueryHandler, registerHandler, run } from "./mediatr/runner";

const db = {};
registerHandler(UserSubscriptionsQuery, (message) => UserSubscriptionsQuery.handle(message, db));

registerHandler(UserSubscriptionsQuery, (message) => {
  // function goes here for per request
  return SaveUserSubscriptionCommand.handle(message, null); 
});


//registerHandler(SaveUserSubscriptionCommand, (message) => SaveUserSubscriptionCommand.handle(message, null));



async function main() {
  
  const userResult = await run(new UserSubscriptionsQuery("123"));
  const saveResult = await run(new SaveUserSubscriptionCommand("123"));
}

main().then(() => console.log("done"));

