import { Monad } from './monad';
import { Just, Maybe, Nothing } from './maybe';

export class IO<T> implements Monad<T> {
    private constructor(private value: Promise<() => T>) { }

    /**
     * Calls `f` with unwrapped value
     * @param f function to call with unwrapped value
     */
    $$_<U>(f: (arg0: T) => IO<U>): IO<U> {
        return new IO(new Promise(cb => {
            this.resolve().then(val => {
                f(val()).value.then(val2 => {
                    cb(val2);
                })
            });
        }));
    }

    /**
     * Evaluates `this` and returns `b` next
     * @param b
     */
    $$<U>(b: IO<U>): IO<U> {
        return this.$$_(_ => {
            return b;
        });
    }

    /**
     * Constructs an IO value
     * @param value value to wrap
     */
    static return<T>(value: T): IO<T> {
        return new IO(Promise.resolve(() => value));
    }

    /**
     * Force lazy evaluation of value
     * @param value lambda function wrapping value
     */
    static returnLazy<T>(value: () => T): IO<T> {
        return new IO(Promise.resolve(value));
    }

    /**
     * Wrap a promise into an IO value
     * @param value lambda function wrapping value
     */
    static returnPromise<T>(value: Promise<T>): IO<T> {
        return new IO(value.then(val => (() => val)));
    }

    /**
     * Evaluates `this`
     * @internal
     */
    resolve(): Promise<() => T> {
        return this.value;
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
 * Gets user input with a prompt
 * @param s prompt for the user
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
export function io_main<T>(command: IO<T>): Promise<T> {
    return new Promise(cb => command.resolve().then(val => cb(val())));
}
