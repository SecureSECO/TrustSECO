import { generateKeyPair } from 'crypto';
import fs from 'fs';
import { Keys } from './types';

const KEY_DIRECTORY = 'keys';
const PRIVATE_KEY_FILE = `${KEY_DIRECTORY}/gpg_rsa`;
const PUBLIC_KEY_FILE = `${KEY_DIRECTORY}/gpg_rsa.pub`;
const PASSWORD = '';

function setup() {
    if (!fs.existsSync(KEY_DIRECTORY)) {
        generateKeys(PASSWORD).then((keys) => storeKeys(keys));
    }
}

const generateKeys = async (password) => new Promise<Keys>((resolve, reject) => {
    generateKeyPair('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: password,
        },
    }, (err, publicKey, privateKey) => {
        if (err) return reject(err);
        resolve({ publicKey, privateKey });
        return undefined;
    });
});

function storeKeys(keys: Keys) {
    fs.mkdirSync(KEY_DIRECTORY);
    fs.writeFileSync(PUBLIC_KEY_FILE, keys.publicKey);
    fs.writeFileSync(PRIVATE_KEY_FILE, keys.privateKey);
}

export async function getKeys(): Promise<Keys> {
    const privateKey = await fs.promises.readFile(PRIVATE_KEY_FILE, 'utf-8');
    const publicKey = await fs.promises.readFile(PUBLIC_KEY_FILE, 'utf-8');

    return {
        privateKey,
        publicKey,
    };
}

export default setup;
