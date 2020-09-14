# ts-monads
This package provides monads based on my (limited) experience with Haskell and has a lot of issues and incomplete functionality.

There are currently two monads provided for use in Typescript:
1. The IO monad wraps input/output operations similar to Haskell
2. The Maybe monad (and type!) provides an interface for maybe types

Note: IO commands are only meant to be used as arguments to a top-level function call of `io_main`.

## Commands
- Compile the package, run `npm run build`
- Run unit tests, run `npm test`
- Run an example, run `ts-node examples/{io,monad}.example.ts`

## Examples
- `examples/io.example.ts` an example that prints `package.json` without "extra" whitespace.
- `examples/maybe.example.ts` an example of a safe `list.head` and division function.

## Drawbacks
The (`>>=`) and (`>>`) operators are not valid identifiers, and TypeScript doesn't support infix operators, so the following are replacements:
- `>>=` is replaced with `$$_` and is called on the left object. E.g. `IO.return(3).$$_(io_log)`
- `>>` is replaced with `$$` and is called on the left object. E.g. `io_log("Hello").$$(io_log("World!"))`

Since TypeScript does not natively support macros, `do` syntax is not supported thus every Monad chain needs to be written manually.
