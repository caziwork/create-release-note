const core = require('@actions/core');

async function run() {
  try {
    console.log(core.getInput('github-token'))
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
