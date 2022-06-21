import { exec } from 'child_process';
import fs from 'fs';
import { Keys } from './types';

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

    return new Promise<string>((resolve, reject) => {
        exec(`gpg -u ${id} --detach-sign --armor -o- /tmp/data-${random}`, (exception, signature, error) => {
            if (exception || error) {
                reject();
                return;
            }

            resolve(signature);
        });
    });
}

export default setup;
