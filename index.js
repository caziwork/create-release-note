const core = require('@actions/core');
const wait = require('./wait');


// most @actions toolkit packages have async methods
async function run() {
  try {
    console.log(core.getInput('github-token'))
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
