const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const token = core.getInput('github-token');
    const client = new github.GitHub(token)

    let tag_name = core.getInput('tag');
    if (tag_name == '') {
      const ref = github.context.payload.ref;
      if (!ref.startsWith('refs/tags/')) {
        throw new Error('this action must run by tag event or specified tag.'); 
      }
      tag_name = ref.replace('refs/tags/', '');
    }
    console.log('tag_name:' + tag_name);

    const res_release = await client.repos.getReleaseByTag({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      tag: tag_name
    });
    if (res_release.status != 200) {
      throw new Error('Get a release by tag name fail');
    }
    const rel_id = res_release.data.id;

    const res_issues = await client.issues.listForRepo({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      state: 'closed'
    });
    if (res_issues.status != 200) {
      throw new Error('List repository issues fail');
    } else if (res_issues.data.length == 0) {
      throw new Error('Issue Not Exist');
    }

    let release_body = '';
    res_issues.data.forEach(issue => {
      if (issue.milestone != null && issue.milestone.title == tag_name) {
        release_body += '- ';
        release_body += issue.title + ' (';
        release_body += '#' + issue.number;
        release_body += ')\n';
      }
    });
    if (release_body == '') {
      throw new Error('Issue Not Exist');
    }

    const res_update = await client.repos.updateRelease({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      release_id: rel_id,
      body: release_body
    });
    if (res_update.status != 200) {
      throw new Error('Edit a release fail');
    }
    console.log('create release note complete');
  }
  catch (error) {
    if (error.message == 'Not Found') {
      console.log('release from tag_name not found.');
      return true;
    } else if (error.message == 'Issue Not Exist') {
      console.log('target issue not exit.');
      return true;
    } else {
      core.setFailed(error.message);
    }
  }
}

run()
