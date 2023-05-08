import jest from 'jest';
import { Query, run, registerHandler, resetHandlers, RunFunction } from '.';

type TestQueryInput = {
  name: string;
}

class TestQuery extends Query<TestQueryInput, string> {
  
  public static async handle(message: TestQuery): Promise<string> {
    return message.input.name;
  }
}

class ParentQuery extends Query<TestQueryInput, string> {
  
  public static async handle(message: ParentQuery, run: RunFunction): Promise<string> {
    const childResult = await run(new TestQuery({ name: message.input.name + ' inner' }));
    return childResult;
  }

  public static async handleRecursive(message: ParentQuery, run: RunFunction): Promise<string> {
    const childResult = await run(new ParentQuery({ name: message.input.name + ' inner' }));
    return childResult;
  }
}

describe('rooster-run', () => {

  describe('run', () => {
    beforeEach(() => {
      resetHandlers();
    });

    it('should throw an error if no message is provided', async () => {
      await expect(() => run(null!)).rejects.toThrow();
    });

    it('should throw an error if no handler is registered', async () => {
      await expect(() => run(new TestQuery({ name: 'test111' }))).rejects.toThrow();
    });

    it('should run a handler', async () => {
      registerHandler(TestQuery, TestQuery.handle);
      const result = await run(new TestQuery({ name: 'test111' }));
      expect(result).toBe('test111');
    });

    describe('executing nested queries', () => {
      it('should run a nested query', async () => {
        registerHandler(ParentQuery, (msg, run) => ParentQuery.handle(msg, run!));
        registerHandler(TestQuery, TestQuery.handle); // Both queries need to be registered
        const result = await run(new ParentQuery({ name: 'test111' }));
        expect(result).toBe('test111 inner');
      });

      it('should run a nested query recursively and throw if it exceeds 5 run', async () => {
        registerHandler(ParentQuery, (msg, run) => ParentQuery.handleRecursive(msg, run!));
        await expect(() => run(new ParentQuery({ name: 'test111' }))).rejects.toThrow('You cannot run more than 5 queries recursively.');
      });
    });
  });
  describe('registerHandler', () => {
    beforeEach(() => {
      resetHandlers();
    });

    it('should throw an error if no type is provided', async () => {
      await expect(() => registerHandler(null!, TestQuery.handle)).toThrow();
    });

    it('should throw an error if no handler is provided', async () => {
      expect(() => registerHandler(TestQuery, null!)).toThrow();
    });

    it('should register a handler', async () => {
      registerHandler(TestQuery, TestQuery.handle);
      const result = await run(new TestQuery({ name: 'test111' }));
      expect(result).toBe('test111');
    });

    it('should throw an error if a handler is already registered', async () => {
      registerHandler(TestQuery, TestQuery.handle);
      expect(() => registerHandler(TestQuery, TestQuery.handle)).toThrow();
    });
  });
});