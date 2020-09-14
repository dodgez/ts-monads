import { Monad } from './monad';

export abstract class Maybe<T> implements Monad<T> {
    /**
     * "Just" or "Nothing"
     */
    abstract type: string;

    /**
     * Calls `f` with unwrapped value if not Nothing
     * @param f function to call with unwrapped value
     */
    abstract $$_<U>(f: (arg0: T) => Maybe<U>): Maybe<U>;

    /**
     * Returns `b` if not Nothing
     * @param b
     */
    abstract $$<U>(b: Maybe<U>): Maybe<U>;

    /**
     * Constructs a Maybe value
     * @param value value to wrap
     */
    static return<T>(value: T): Maybe<T> {
        return Just<T>(value);
    }
}

class IJust<T> implements Maybe<T> {
    type: string = "Just";
    constructor(public value: T) { }

    /**
     * Calls `f` with the unwrapped value
     * @param f
     */
    $$_<U>(f: (arg0: T) => Maybe<U>): Maybe<U> {
        return f(this.value);
    }

    /**
     * Returns `b`
     * @param b
     */
    $$<U>(b: Maybe<U>): Maybe<U> {
        return b;
    }
}

class INothing<T> implements Maybe<T> {
    /**
     * Type of Maybe<T> is Nothing
     */
    type: string = "Nothing";
    constructor() { }

    /**
     * Returns `Nothing`
     * @param _
     */
    $$_<U>(_: (arg0: T) => Maybe<U>): Maybe<U> {
        return Nothing<U>();
    }

    /**
     * Returns `Nothing`
     * @param b
     */
    $$<U>(_: Maybe<U>): Maybe<U> {
        return Nothing<U>();
    }
}

export function Just<T>(value: T): Maybe<T> {
    return new IJust<T>(value);
}

export function Nothing<T>(): Maybe<T> {
    return new INothing<T>();
}

export function fromJust<T>(maybe: Maybe<T>): T {
    if (maybe.type == "Just")
        return (maybe as IJust<T>).value;
    else
        throw "Error: unwrapped Nothing"
}

export function fromMaybe<T>(a: T, maybe: Maybe<T>): T {
    if (maybe.type == "Just")
        return (maybe as IJust<T>).value;
    else
        return a;
}
