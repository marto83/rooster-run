export interface IMessage<T> {
  __type: T; // This property is only used to help Typescript with Type inference.
}

abstract class MessageBase<TInput, T> implements IMessage<T> {
  __type!: T;
  readonly input: TInput;

  constructor(input: TInput) {
    this.input = Object.freeze(input);
  }
}

export abstract class Query<TInput, T> extends MessageBase<TInput, T> {}

export abstract class Command<TInput, T> extends MessageBase<TInput, T> {}

export abstract class Workflow<TInput, T> extends MessageBase<TInput, T> {}

export abstract class Request<TInput, T> extends MessageBase<TInput, T> {}

export type IQueryHandler<TMessage extends IMessage<T>, T> = (message: TMessage) => Promise<T>; 

export type Constructor<T> = new (...args: any[]) => T;

const handlers: Map<Constructor<IMessage<any>>, IQueryHandler<IMessage<any>, any>> = new Map();

export function resetHandlers() {
  handlers.clear();
}

export function registerHandler<TMessage extends IMessage<T>, T>(type: Constructor<TMessage>, handler: IQueryHandler<TMessage, T>): void {
    
  if(!type || !handler)
    throw new Error("type and handler are both required.");

  // Add unique checks
  if(handlers.has(type))
    throw new Error(`A handler for ${type?.name} is already registered.`);

  handlers.set(type, handler as IQueryHandler<IMessage<any>, any>);

}

export async function run<T>(message: IMessage<T>): Promise<T> {

  if(!message)
    throw new Error("message is required.");

  const handler = handlers.get(message.constructor as Constructor<IMessage<any>>);
  if (!handler) 
    throw new Error(`No handler found for message ${message.constructor.name}`);
  

  return (await handler(message)) as T;
}