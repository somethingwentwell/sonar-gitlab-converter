#!/usr/bin/env node

import yargs from 'yargs/yargs';
import axios from 'axios';
import { sonarIssue, convert } from './src/converter';
import fs from 'fs';

const parser = yargs(process.argv.slice(2)).options({
    host: { type: 'string', default: 'https://sonarqube.com' },
    token: { type: 'string', default: '' },
    project: { type: 'string', default: '' }
});

(async() => {

    const argv = await parser.argv;

    if (argv.token === '' || argv.project === '') {
        console.log('Please provide a token and project name');
        process.exit(1);
    }

    let authToken = Buffer.from(argv.token + ':').toString('base64');
    console.log(authToken);
    
    let config = {
      method: 'get',
      url: `${argv.host}/api/server/version`,
      headers: { 
        'Authorization': `Basic ${authToken}`
      }
    }
    let response = await axios(config);
    const version = response.data;
    console.log(`Version: ${response.data}`);

    config = {
      method: 'get',
      url: `${argv.host}/api/issues/search?componentKeys=${argv.project}`,
      headers: { 
        'Authorization': `Basic ${authToken}`,
      }
    };
    try {
        response = await axios(config);
        // console.log(response.data);
        let sonarIssues: sonarIssue[] = await response.data.issues;
    
        fs.writeFile('gl-sast-report.json', JSON.stringify(convert(sonarIssues, version)) , function (err) {
            if (err) return console.log(err);
            console.log('Saved!');
          }
        );
    }
    catch (error) {
        console.log(error);
    }


})();