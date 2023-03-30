# Rooster run

![logo](./logo.jpg)

Rooster run is a simple library that implements the mediator pattern and allows registration and execution of commands and queries. 
It is roughly based on the MediatR library, but it is much simpler and has no dependencies. 
It centralises dependencies management and allows for smaller and more focused classes. 

## Usage

The library has two main abstract classes: `Command` and `Query` which are there to be extended. They are mainly for sytaxic sugar and to allow for type checking. They make it easier to implement Command Query Segregation (CQS) pattern in your application. `Commands` are used to modify state and may return a value. `Queries` are used to retrieve data and may return a value. Here is an example of a command and a query:


```typescript
import { Query, Command } from 'rooster-run';

class UsersQuery extends Query<string[]> {
    constructor() {
        super();
    }

    public static async handler(query: UsersQuery): Promise<string[]> {
        return ['user1', 'user2'];
    }
}

class UserQuery extends Query<string> {
    constructor(public username: string) {
        super();
    }

    public static async handler(query: UserQuery, db: DbSchema): Promise<string> {
        return await db.users.find(user => user.username === query.username);
    }
}

class SaveUserCommand extends Command<string> {
    constructor(public user: User) {
        super();
    }

    public static async handler(command: SaveUserCommand, db: DbSchema): Promise<void> {
        await db.users.push(command.user);
    }
}
```

## Registering handlers

In the example above, we have defined three classes: `UsersQuery`, `UserQuery` and `SaveUserCommand`. The class itself holds the data needed for the query to be exectued. The actual logic is in the handler function. Any dependencies are also passed to the handler at the point of registration. 

```typescript
import { registerHandler } from 'rooster-run';

const db = await initDb();

registerHandler(UsersQuery, UsersQuery.handler);
registerHandler(UserQuery, (query) => UserQuery.handler(query, db));
registerHandler(SaveUserCommand, (command) => SaveUserCommand.handler(command, db));

```

## How to run queries and commands

Queries and commands are run using the `run` function. The function takes a query or command as an argument and returns a promise. 

```typescript

import { run } from 'rooster-run';

const users = await run(new UsersQuery());

```