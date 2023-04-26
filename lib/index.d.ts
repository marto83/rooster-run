export interface IMessage<T> {
    __type: T;
}
declare abstract class MessageBase<TInput, T> implements IMessage<T> {
    __type: T;
    readonly input: TInput;
    constructor(input: TInput);
}
export declare abstract class Query<TInput, T> extends MessageBase<TInput, T> {
}
export declare abstract class Command<TInput, T> extends MessageBase<TInput, T> {
}
export type IQueryHandler<TMessage extends IMessage<T>, T> = (message: TMessage) => Promise<T>;
export type Constructor<T> = new (...args: any[]) => T;
export declare function resetHandlers(): void;
export declare function registerHandler<TMessage extends IMessage<T>, T>(type: Constructor<TMessage>, handler: IQueryHandler<TMessage, T>): void;
export declare function run<T>(message: IMessage<T>): Promise<T>;
export {};
