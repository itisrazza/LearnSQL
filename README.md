# LearnSQL

LearnSQL is a website made for you to experiment and learn about SQL databases by trying out various commands. It's based on the widely used SQLite database system which is used a wide variety of applications.

At the moment, it's just a simple prompt with an interface for viewing database contents. However I want to add integrated tutorials for users to step through so they can get familiar with how relational databases, and the syntax for retrieving information works.

## Under the Hood

Under the hood, LearnSQL uses [sql.js](https://github.com/kripken/sql.js/) which is effectively [SQLite](https://sqlite.org/) compiled for WebAssembly.
