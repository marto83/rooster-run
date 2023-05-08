
/**
 * IMessage represents the base interface for messages in the CQS pattern.
 * The __type property helps with TypeScript type inference.
 */
export interface IMessage<T> {
  __type: T; // This property is only used to help Typescript with Type inference.
}

/**
 * MessageBase is an abstract class that provides common functionality for all message types.
 * It stores the input data in a frozen state to ensure immutability.
 */
abstract class MessageBase<TInput, T> implements IMessage<T> {
  __type!: T;
  readonly input: TInput;

  constructor(input: TInput) {
    this.input = Object.freeze(input);
  }
}

/**
 * Query represents an abstract class for query messages, which return data without changing the system state.
 */
export abstract class Query<TInput, T> extends MessageBase<TInput, T> {}

/**
 * Command represents an abstract class for command messages, which change the system state and may return data.
 */
export abstract class Command<TInput, T> extends MessageBase<TInput, T> {}

/**
 * Workflow represents an abstract class for workflow messages, which may involve a series of commands and/or queries.
 */
export abstract class Workflow<TInput, T> extends MessageBase<TInput, T> {}

/**
 * Request represents an abstract class for request messages, which can be used for more general interactions.
 */
export abstract class Request<TInput, T> extends MessageBase<TInput, T> {}

/**
 * RunFunction is a type alias for a function that processes a message and returns a Promise with the result.
 */
export type RunFunction = <T>(message: IMessage<T>) => Promise<T>;

/**
 * IQueryHandler is a type alias for a function that handles a specific type of message.
 * There is no need to use it directly. Use registerHandler instead.
 */
export type IQueryHandler<TMessage extends IMessage<T>, T> = (
  message: TMessage,
  run: RunFunction
) => Promise<T>;

/**
 * Constructor is a type alias for a constructor function that creates instances of a given type.
 */
export type Constructor<T> = new (...args: any[]) => T;

/**
 * CqsCommander is a class that manages the registration and execution of command and query handlers.
 * It provides a mechanism to run messages and get results through the registered handlers.
 */
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

/**
 * globalCommander is an instance of the CqsCommander class that is used as the default commander.
 */
const globalCommander = new CqsCommander();

/**
 * run is a function that processes a message using the globalCommander instance and returns the result as a Promise.
 */
export const run = globalCommander.run.bind(globalCommander);
/**
 * Registers a new handler for a specific message type with the CqsCommander instance.
 */
export const registerHandler = globalCommander.registerHandler.bind(globalCommander);

/**
 * Clears all registered handlers from the global CsqCommander instance.
 * It is mainly used for testing purposes.
 */
export const resetHandlers = globalCommander.resetHandlers.bind(globalCommander);