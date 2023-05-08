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

export type RunFunction = <T>(message: IMessage<T>) => Promise<T>;

export type IQueryHandler<TMessage extends IMessage<T>, T> = (
  message: TMessage,
  run: RunFunction
) => Promise<T>;

export type Constructor<T> = new (...args: any[]) => T;

export class CqsCommander {
  constructor(private maxRecursionDepth: number = 5) {}
  handlers: Map<Constructor<IMessage<any>>, IQueryHandler<IMessage<any>, any>> =
    new Map();

  resetHandlers(): void {
    this.handlers.clear();
  }

  registerHandler<TMessage extends IMessage<T>, T>(
    type: Constructor<TMessage>,
    handler: IQueryHandler<TMessage, T>
  ): void {
    if (!type || !handler)
      throw new Error("type and handler are both required.");

    // Add unique checks
    if (this.handlers.has(type))
      throw new Error(`A handler for ${type?.name} is already registered.`);

    this.handlers.set(type, handler as IQueryHandler<IMessage<any>, any>);
  }

  private runInternal<T>(
    message: IMessage<T>,
    recursionDepth: number,
    runFn: RunFunction
  ): Promise<T> {
    if (recursionDepth > this.maxRecursionDepth) {
      throw new Error(
        `You cannot run more than ${this.maxRecursionDepth} queries recursively. `
      );
    }

    const handler = this.handlers.get(
      message.constructor as Constructor<IMessage<any>>
    );
    if (!handler)
      throw new Error(
        `No handler found for message ${message.constructor.name}`
      );

    return handler(message, (msg) =>
      this.runInternal(msg, recursionDepth + 1, runFn)
    ) as Promise<T>;
  }

  async run<T>(message: IMessage<T>): Promise<T> {
    return (await this.runInternal(message, 0, this.run)) as T;
  }
}

const globalCommander = new CqsCommander();
export const run = globalCommander.run.bind(globalCommander);
export const registerHandler = globalCommander.registerHandler.bind(globalCommander);
export const resetHandlers = globalCommander.resetHandlers.bind(globalCommander);