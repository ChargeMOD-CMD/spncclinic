const https = require('https');
const fs = require('fs');

const options = {
  hostname: 'api.github.com',
  path: '/repos/ChargeMOD-CMD/spncclinic/actions/runs?per_page=1',
  headers: { 'User-Agent': 'Node.js' }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    const run = json.workflow_runs[0];
    console.log('Latest Run ID:', run.id, run.name);
    
    https.get({
      hostname: 'api.github.com',
      path: `/repos/ChargeMOD-CMD/spncclinic/actions/runs/${run.id}/jobs`,
      headers: { 'User-Agent': 'Node.js' }
    }, (res2) => {
      let data2 = '';
      res2.on('data', chunk => data2 += chunk);
      res2.on('end', () => {
        const jobs = JSON.parse(data2).jobs;
        console.log('Jobs:', jobs.map(j => `${j.name}: ${j.conclusion}`));
        const buildJob = jobs.find(j => j.name === 'build');
        
        if (buildJob) {
          https.get({
            hostname: 'api.github.com',
            path: `/repos/ChargeMOD-CMD/spncclinic/actions/jobs/${buildJob.id}/logs`,
            headers: { 'User-Agent': 'Node.js' }
          }, (res3) => {
            // Logs are returned as text, but might be redirected. Let's handle 302 if needed.
            if (res3.statusCode === 301 || res3.statusCode === 302) {
              https.get(res3.headers.location, (res4) => {
                let data4 = '';
                res4.on('data', chunk => data4 += chunk);
                res4.on('end', () => {
                  fs.writeFileSync('action-logs.txt', data4);
                  console.log('Saved logs to action-logs.txt');
                });
              });
            } else {
              let data3 = '';
              res3.on('data', chunk => data3 += chunk);
              res3.on('end', () => {
                fs.writeFileSync('action-logs.txt', data3);
                console.log('Saved logs to action-logs.txt');
              });
            }
          });
        }
      });
    });
  });
}).on('error', (err) => console.error(err));
