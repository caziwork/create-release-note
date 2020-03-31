const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    //console.log(core.getInput('github-token'))
    console.log(github.context.payload);
    console.log(github.context.repo.owner);
    console.log(github.context.repo.repo);


  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
