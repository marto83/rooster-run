
import { IQuery, addLogging } from './runner';
import { Either, right, left } from 'fp-ts/lib/Either';

export type UserSubscription = {
};


export class UserSubscriptionsQuery implements IQuery<Either<Error,UserSubscription[]>> {
  constructor(public userId: string) {
  }

  @addLogging
  public static async handle(message: UserSubscriptionsQuery, repo: any): Promise<Either<Error, UserSubscription[]>> {

    // Go to the DB 
    // Get the user subscriptions
    console.log("returning user subs")
    return right([]);
  }
}

export class SaveUserSubscriptionCommand implements IQuery<Either<Error, void>> {
  constructor(public userId: string) {
  }

  @addLogging
  public static async handle(message: SaveUserSubscriptionCommand, repo: any): Promise<Either<Error, void>> {

    if(message.userId === "123") {
      return left(new Error("User not found"));
    }
    
    return right(undefined);
  }
}