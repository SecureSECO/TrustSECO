import { exec } from 'child_process';
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

        const id = genOut.split(':')[4];

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

                resolve({
                    id,
                    privateKey,
                    publicKey,
                });
            });
        });
    });
});

export const signMessage = async (message, id) => new Promise<string>((resolve, reject) => {
    exec(`gpg -u ${id} --sign --armor -o- <(printf '${message}')`, {
        shell: '/bin/bash',
    }, (exception, signature, error) => {
        if (exception || error) {
            reject();
            return;
        }

        resolve(signature);
    });
});

export default setup;
