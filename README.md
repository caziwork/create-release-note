# Create Release Note

This action collect issues by tag name(match milestone) and create release note.

# Usage
```yaml
on:
  push:
    tags:
      - 'v*'

jobs:
  job-name:
    runs-on: ubuntu-latest
    steps:
    - uses: mougenko/create-release-note@v1.0.0
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
```
