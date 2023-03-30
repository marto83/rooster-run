interface IMessage<T> {
  __brand: T;
}

abstract class Query<T> implements IMessage<T> {
  __brand!: T;
}

abstract class Command<T> implements IMessage<T> {
  __brand!: T;
}

type IQueryHandler<TMessage extends IMessage<T>, T> = (message: TMessage) => Promise<T>; 

export type Constructor<T> = new (...args: any[]) => T;

const handlers: Map<Constructor<any>, IQueryHandler<IMessage<any>, any>> = new Map();

function resetHandlers() {
  handlers.clear();
}

function registerHandler<TMessage extends IMessage<T>, T>(type: Constructor<TMessage>, handler: IQueryHandler<TMessage, T>): void {
    
  if(!type || !handler)
    throw new Error("type and handler are both required.");

  // Add unique checks
  if(handlers.has(type))
    throw new Error(`A handler for ${type?.name} is already registered.`);

  handlers.set(type, handler as IQueryHandler<IMessage<any>, any>);

}

async function run<T>(message: IMessage<T>): Promise<T> {

  if(!message)
    throw new Error("message is required.");

  const handler = handlers.get(message.constructor as Constructor<any>);
  if (!handler) 
    throw new Error(`No handler found for message ${message.constructor.name}`);
  

  return (await handler(message)) as T;
}

export { IMessage, Query, Command, IQueryHandler, registerHandler, run, resetHandlers };