console.log('hello')
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/function';
import { Either, Do,  } from 'fp-ts/lib/Either'
import { UserSubscription } from './mediatr/userSubscriptionsQuery';

import { UserSubscriptionsQuery, SaveUserSubscriptionCommand } from "./mediatr/userSubscriptionsQuery";
import { IMessage, IQueryHandler, registerHandler, run } from "./mediatr/runner";

const db = {};
registerHandler(UserSubscriptionsQuery, (message) => UserSubscriptionsQuery.handle(message, db));

const handler : IQueryHandler<SaveUserSubscriptionCommand, E.Either<Error, void>> = (message) => SaveUserSubscriptionCommand.handle(message, null);
registerHandler(UserSubscriptionsQuery, handler);

//registerHandler(SaveUserSubscriptionCommand, (message) => SaveUserSubscriptionCommand.handle(message, null));



async function main() {
  run<UserSubscriptionsQuery>()(new UserSubscriptionsQuery("123"));
  
  const userResult = await run<Either<Error, UserSubscription[]>>(new UserSubscriptionsQuery("123"));
  const saveResult = await run(new SaveUserSubscriptionCommand("123"));
}

main().then(() => console.log("done"));

