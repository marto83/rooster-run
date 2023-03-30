import { Type } from "typescript";

export interface IMessage<T> {
}

export interface IQuery<T> extends IMessage<T> {

}

export interface Command<T> extends IMessage<T> {
  
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
export type MessageIdentifier = string | symbol;

const handlers: Map<Constructor<any>, IQueryHandler<IMessage<any>, any>> = new Map();

export function registerHandler<TMessage extends IMessage<T>, T>(type: Constructor<TMessage>, handler: IQueryHandler<TMessage, T>): void {
    handlers.set(type, handler as IQueryHandler<IMessage<any>, any>);
}

export async function run<T>(message: IMessage<T>): Promise<T> {
    const handler = handlers.get(message.constructor as Constructor<IMessage<any>>);
    if (!handler) {
        throw new Error(`No handler found for message ${message.constructor.name}`);
    }

    return await handler(message) as T;
}
