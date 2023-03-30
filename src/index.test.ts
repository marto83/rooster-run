import jest from 'jest';
import { Query, run, registerHandler, resetHandlers } from '.';

class TestQuery extends Query<string> {
  constructor(public name: string) {
    super();
  }

  public static async handle(message: TestQuery): Promise<string> {
    return message.name;
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
      await expect(() => run(new TestQuery('test111'))).rejects.toThrow();
    });

    it('should run a handler', async () => {
      registerHandler(TestQuery, TestQuery.handle);
      const result = await run(new TestQuery('test111'));
      expect(result).toBe('test111');
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
      const result = await run(new TestQuery('test111'));
      expect(result).toBe('test111');
    });

    it('should throw an error if a handler is already registered', async () => {
      registerHandler(TestQuery, TestQuery.handle);
      expect(() => registerHandler(TestQuery, TestQuery.handle)).toThrow();
    });
  });
});