export interface Monad<T> {
    $$_<U>(f: (arg0: T) => Monad<U>): Monad<U>;
    $$<U>(b: Monad<U>): Monad<U>;
}
