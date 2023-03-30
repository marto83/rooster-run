interface IMessage<T> {
    __brand: T;
}
declare abstract class Query<T> implements IMessage<T> {
    __brand: T;
}
declare abstract class Command<T> implements IMessage<T> {
    __brand: T;
}
type IQueryHandler<TMessage extends IMessage<T>, T> = (message: TMessage) => Promise<T>;
export type Constructor<T> = new (...args: any[]) => T;
declare function resetHandlers(): void;
declare function registerHandler<TMessage extends IMessage<T>, T>(type: Constructor<TMessage>, handler: IQueryHandler<TMessage, T>): void;
declare function run<T>(message: IMessage<T>): Promise<T>;
export { IMessage, Query, Command, IQueryHandler, registerHandler, run, resetHandlers };
