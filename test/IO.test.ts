import { compose } from 'lodash/fp';
import { expect, use } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
use(sinonChai);

import { IO, io_error, io_log, io_main } from '../dist/index';

describe('IO', function () {
    describe('monad', function () {
        it('binds', async function () {
            const ioToString = function (a: number): IO<string> {
                return IO.return(a.toString());
            }
            const value = 1;
            let command = IO.return(value).$$_(ioToString);
            expect((await command.resolve())()).to.equal("1");
        });

        it('directionally binds', async function () {
            const values = [1, 2];
            let command = IO.return(values[0]).$$(IO.return(values[1]));
            expect((await command.resolve())()).to.equal(values[1]);
        });

        it('wraps a value', async function () {
            const value = 1;
            let command = IO.return(value);
            expect((await command.resolve())()).to.equal(value);
        });
    });

    describe('io_main', function () {
        it('runs a command', async function () {
            const value = 1;
            let command = IO.return(value);
            expect(await io_main(command)).to.equal(value);
        });

        it('lazy evaluates', async function () {
            const value = 1;
            let io_value = IO.returnLazy(() => value);
            expect((await io_value.resolve())()).to.equal(value);
        });
    });

    describe('Promise', function () {
        it('converts to IO', async function () {
            const command = IO.returnPromise(new Promise(cb => setTimeout(() => cb(2), 100)));
            expect(await io_main(command)).to.equal(2);
        });
    });

    describe('Full Stack', function () {
        let logStub: any;
        let errorStub: any;

        beforeEach(function () {
            logStub = sinon.stub(console, 'log');
            errorStub = sinon.stub(console, 'error');
        });

        afterEach(function () {
            logStub.restore();
            errorStub.restore();
        })

        it('logs messages', async function () {
            const greeting = "Hello, World!";
            await io_main(io_log(greeting));
            expect(console.log).to.have.been.calledWith(greeting);
        });

        it('logs errors', async function () {
            const message = "Everything broke!";
            await io_main(io_error(message));
            expect(console.error).to.have.been.calledWith(message);
        });

        it('is lazy', async function () {
            const message = "Should not run";
            io_log(message);
            expect(console.log).to.not.have.been.called;
        });

        it('executes pure functions on an IO value', async function () {
            const value = 1;
            const double = (a: number) => 2 * a;
            let io_value = IO.return(value);
            // Calling pure functions with IO values is as simple
            //  as binding an anonymous function that wraps the result.
            // I.e. anon = compose(IO.return, pure)
            let result = io_value.$$_(compose(IO.return, double));
            expect((await result.resolve())()).to.equal(double(value));
        });
    });
});
