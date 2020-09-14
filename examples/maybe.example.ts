import { fromMaybe, Just, Maybe, Nothing } from '../dist/index';

function head<T>(list: Array<T>): Maybe<T> {
    if (list.length)
        return Just(list[0]);
    else
        return Nothing();
}

console.log("Head of [1] is: ", fromMaybe(-1, head([1])));
console.log("Head of [1, 2] is: ", fromMaybe(-1, head([1, 2])));
console.log("Head of [] (with default) is: ", fromMaybe(-1, head([])));

console.log();

function divide(a: number, b: number): Maybe<number> {
    if (b == 0)
        return Nothing();
    else
        return Just(a / b);
}

console.log("1/1 is: ", fromMaybe(0, divide(1, 1)));
console.log("1/2 is: ", fromMaybe(0, divide(1, 2)));
console.log("1/0 (with default) is: ", fromMaybe(0, divide(1, 0)));
