const axios = require('axios');
const fs = require('fs');
const AdmZip = require('adm-zip');
require('dotenv')
  .config();

const owner = 'Fides-UU';
const repo = 'TrustSECO-Portal';
const directory = 'public';
const githubToken = process.env.GITHUB_API_TOKEN;

if (!githubToken) {
  console.log('No GITHUB_API_TOKEN was found in your .env file, please add it and retry.')
  return false;
}

const instance = axios.create({
  headers: {
    Authorization: `token ${githubToken}`,
  },
});

(async () => {
  const { data: { artifacts } } = await instance.get(`https://api.github.com/repos/${owner}/${repo}/actions/artifacts`);

  const downloadUrl = artifacts[0].archive_download_url;

  const response = await instance.get(downloadUrl, {
    responseType: 'stream',
  });

  // Writing data to file.
  const writeStream = fs.createWriteStream('portal.zip');

  response.data.pipe(writeStream);

  writeStream.on('finish', () => {
    // Creating directoy
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }

    // Extracting data
    const archive = new AdmZip('portal.zip'); // noinspection JSCheckFunctionSignatures
    archive.extractAllTo(directory, true); // noinspection JSCheckFunctionSignatures

    // Delete download
    fs.unlinkSync('portal.zip');
  });
})();
