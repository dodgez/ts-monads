import { expect } from 'chai';

import { fromJust, Just, Maybe, Nothing } from '../dist/index';

describe('Maybe', function () {
    describe('monad', function () {
        it('binds', function () {
            const maybeToString = function (a: number): Maybe<string> {
                return Just(a.toString());
            }
            const value = 1;
            let command = Just(value).$$_(maybeToString);
            expect(command.type).equal("Just");
            expect(fromJust(command)).equal(value.toString());

            let second = Nothing<number>().$$_(maybeToString);
            expect(second.type).equal("Nothing");
        });

        it('directionally binds', function () {
            const first = Nothing().$$(Nothing());
            expect(first.type).equal("Nothing");

            const second = Nothing().$$(Just(1));
            expect(second.type).equal("Nothing");

            const third = Just(1).$$(Nothing());
            expect(third.type).equal("Nothing");

            const value = 2;
            const fourth = Just(1).$$(Just(value));
            expect(fourth.type).equal("Just");
            expect(fromJust(fourth)).to.equal(value);
        });
    });

    describe('Type', function () {
        it('can construct Nothing', function () {
            const maybe = Nothing<number>();
            expect(maybe.type).to.equal("Nothing");
        });

        it('can construct Just a', function () {
            const value = 1;
            const maybe = Just<number>(value);
            expect(maybe.type).to.equal("Just");
            expect(fromJust(maybe)).to.equal(value);
        });
    });
});
