import { exec } from 'child_process';
import { FileFactoryBase, FsFileFactory } from 'lite-ts-fs';
import { promisify } from 'util';

const promiseExec = promisify(exec);

(async () => {
    const fileFactory: FileFactoryBase = new FsFileFactory();
    await fileFactory.buildDirectory(__dirname, '..', 'dist').remove();
    
    await promiseExec('npm i');

    const typeDir = fileFactory.buildDirectory(__dirname, '..', 'node_modules', '@types');
    const files = await fileFactory.buildDirectory(__dirname, '..', '@types').findFiles();
    for (const r of files) {
        await r.copyTo(
            fileFactory.buildFile(typeDir.path, r.name).path
        );
    }

    await promiseExec('tsc -b build.tsconfig.json');
})();