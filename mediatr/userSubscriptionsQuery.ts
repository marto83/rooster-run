
import { Query, addLogging, Command, IMessage } from './runner';
import { Either, right, left } from 'fp-ts/lib/Either';


export type UserSubscription = {
};


export class UserSubscriptionsQuery extends Query<Either<Error,UserSubscription[]>> {
  
  constructor(public userId: string) {
    super();
  }

  

  @addLogging
  public static async handle(message: UserSubscriptionsQuery, repo: any): Promise<Either<Error, UserSubscription[]>> {

    // Go to the DB 
    // Get the user subscriptions
    console.log("returning user subs")
    return right([]);
  }
}

export class SaveUserSubscriptionCommand extends Command<Either<Error, void>> {
  
  constructor(public userId: string) {
    super();
  }

  @addLogging
  public static async handle(message: SaveUserSubscriptionCommand, repo: any): Promise<Either<Error, "SaveUserSubscriptionCommand">> {

    if(message.userId === "123") {
      return left(new Error("User not found"));
    }
    
    return right("SaveUserSubscriptionCommand");
  }
}