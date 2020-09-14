import { Monad } from './monad';
import { Just, Maybe, Nothing } from './maybe';

export class IO<T> implements Monad<T> {
    private constructor(private value: () => T) { }

    /**
     * Calls `f` with unwrapped value
     * @param f function to call with unwrapped value
     */
    $$_<U>(f: (arg0: T) => IO<U>): IO<U> {
        return f(this.resolve());
    }

    /**
     * Evaluates `this` and returns `b` next
     * @param b
     */
    $$<U>(b: IO<U>): IO<U> {
        this.resolve();
        return b;
    }

    /**
     * Constructs an IO value
     * @param value value to wrap
     */
    static return<T>(value: T): IO<T> {
        return new IO(() => value);
    }

    /**
     * Force lazy evaluation of value
     * @param value lambda function wrapping value
     */
    static returnLazy<T>(value: () => T): IO<T> {
        return new IO(value);
    }

    /**
     * Evaluates `this`
     * @internal
     */
    resolve(): T {
        return this.value();
    }
}

/**
 * Logs an object via o.toString()
 * @param o object to be logged
 */
export function io_log(o: Object): IO<void> {
    return IO.returnLazy(() => console.log(o.toString()));
}

/**
 * Logs an error with object via o.toString()
 * @param o object to be logged
 */
export function io_error(o: Object): IO<void> {
    return IO.returnLazy(() => console.error(o.toString()));
}

/**
 * 
 * @param command 
 */
export function io_prompt(s: string): IO<Maybe<string>> {
    return IO.returnLazy(() => {
        let res = prompt(s);
        if (res)
            return Just(res as string);
        else
            return Nothing();
    });
}

/**
 * Entry-point for an IO program. Return value
 *  to be used sparingly
 * @param command the action to be executed
 */
export function io_main<T>(command: IO<T>): T {
    return command.resolve();
}
