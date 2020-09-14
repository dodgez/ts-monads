import { compose } from 'lodash/fp';
import { expect, use } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
use(sinonChai);

import { IO, io_error, io_log, io_main } from '../dist/index';

describe('IO', function () {
    describe('monad', function () {
        it('binds', function () {
            const ioToString = function (a: number): IO<string> {
                return IO.return(a.toString());
            }
            const value = 1;
            let command = IO.return(value).$$_(ioToString);
            expect(command.resolve()).equal("1");
        });

        it('directionally binds', function () {
            const values = [1, 2];
            let command = IO.return(values[0]).$$(IO.return(values[1]));
            expect(command.resolve()).equal(values[1]);
        });

        it('wraps a value', function () {
            const value = 1;
            let command = IO.return(value);
            expect(command.resolve()).equal(value);
        });
    });

    describe('io_main', function () {
        it('runs a command', function () {
            const value = 1;
            let command = IO.return(value);
            expect(io_main(command)).equal(value);
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

        it('logs messages', function () {
            const greeting = "Hello, World!";
            io_main(io_log(greeting));
            expect(console.log).to.have.been.calledWith(greeting);
        });

        it('logs errors', function () {
            const message = "Everything broke!";
            io_main(io_error(message));
            expect(console.error).to.have.been.calledWith(message);
        });

        it('executes pure functions on an IO value', function () {
            const value = 1;
            const double = (a: number) => 2 * a;
            let io_value = IO.return(value);
            // Calling pure functions with IO values is as simple
            //  as binding an anonymous function that wraps the result.
            // I.e. anon = compose(IO.return, pure)
            let result = io_value.$$_(compose(IO.return, double));
            expect(result.resolve()).to.equal(double(value));
        });
    });
});
