import { compose, replace } from 'lodash/fp';
import fs from 'fs';

import { IO, io_log, io_main } from '../dist/index';

function io_read_file(path: string): IO<string> {
    return IO.returnLazy(() => fs.readFileSync(path, 'utf8'));
}

io_main(io_read_file("package.json").$$_(compose(IO.return, replace(/( {2})|[\t\r\n]+/g, ""))).$$_(io_log));
