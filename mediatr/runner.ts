export type UserSubscription = {
  
};


export interface IMessage<T> {
  __brand: T;
}


export abstract class Query<T> implements IMessage<T> {
  __brand!: T;
}

export abstract class Command<T> implements IMessage<T> {
  __brand!: T;
}

export type IQueryHandler<TMessage extends IMessage<T>, T> = (message: TMessage) => Promise<T>; 

export function addLogging(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey} with arguments: `, args);
    const result = originalMethod.apply(this, args);
    console.log(`Result of ${propertyKey}: `, result);
    return result;
  };

  return descriptor;
}

type Constructor<T> = new (...args: any[]) => T;

const handlers: Map<Constructor<any>, IQueryHandler<IMessage<any>, any>> = new Map();

export function registerHandler<TMessage extends IMessage<T>, T>(type: Constructor<TMessage>, handler: IQueryHandler<TMessage, T>): void {
    
  // Add unique checks
  if(handlers.has(type))
    throw new Error("boom");

  handlers.set(type, handler as IQueryHandler<IMessage<any>, any>);

}

export async function run<T>(message: IMessage<T>): Promise<T> {
  const handler = handlers.get(message.constructor as Constructor<any>);
  if (!handler) {
    throw new Error(`No handler found for message ${message.constructor.name}`);
  }

  return (await handler(message)) as T;
}

export class UserSubscriptionsQuery extends Query<string> {

  constructor(public userId: string) {
    super();
  }

  public static async handle(message: UserSubscriptionsQuery, repo: any): Promise<string> {

    // Go to the DB 
    // Get the user subscriptions
    console.log("returning user subs")
    return "" as string;
  }
}

const userResult = run(new UserSubscriptionsQuery("123"));
