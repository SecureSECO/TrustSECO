import { exec } from 'child_process';
import fs from 'fs';
import { promisify } from 'util';
import { Keys } from './types';

const exec$ = promisify(exec);

function setup() {
    generateKeys();
}

const generateKeys = async () => new Promise<void>((resolve, reject) => {
    exec('gpg --quick-generate-key --batch --passphrase "" root', (error, stdout, stderr) => {
        resolve();
    });
});

export const getKeys = async () => new Promise<Keys>((resolve, reject) => {
    exec('gpg --list-secret-keys --with-colons root', (genExcep, genOut, genError) => {
        if (genExcep) {
            console.log(genExcep);
            reject();
            return;
        }

        let id = genOut.split(':')[4];

        exec(`gpg --armor --export ${id}`, (publicExc, publicKey, publicError) => {
            if (publicExc) {
                console.log(publicExc);
                reject();
                return;
            }

            exec(`gpg --armor --export-secret-key ${id}`, (privateExc, privateKey, privateErr) => {
                if (privateExc) {
                    console.log(privateExc);
                    reject();
                    return;
                }

                id = id.slice(-16);

                resolve({
                    id,
                    privateKey,
                    publicKey,
                });
            });
        });
    });
});

export async function signMessage(message, id) {
    const random = Math.random().toString().slice(2);

    await fs.promises.writeFile(`/tmp/data-${random}`, message);
    await exec$(`gpg -u ${id} --detach-sign --armor /tmp/data-${random}`);

    const path = `/tmp/data-${random}.asc`;
    const signature = await fs.promises.readFile(path, 'utf-8');

    await fs.promises.unlink(path);

    return signature;
}

/* export const signMessage = async (message, id) => new Promise<string>((resolve, reject) => {
    exec(`gpg -u ${id} --detach-sign --armor -o- <(printf '${message}')`, {
        shell: '/bin/bash',
    }, (exception, signature, error) => {
        if (exception) {
            reject();
            return;
        }
        resolve(signature);
    });
}); */

export default setup;

/* This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
© Copyright Utrecht University (Department of Information and Computing Sciences) */