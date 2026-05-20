# Simple Local Project Website

## Push Changes To GitHub

### Prompt To Ask Codex

Copy and paste this prompt when you want Codex to push changes to GitHub for you:

```text
Please push my current website changes to GitHub. Check git status, commit with a clear message, and push to the current branch. If anything looks risky, ask me first.
```

## Behind the Door, GPT does the following 

Use these commands when you are ready to save your changes and send them to GitHub:

```bash
git status
git add .
git commit -m "Describe what changed"
git push
```

What each command does:

- `git status` shows which files changed.
- `git add .` adds all changed files to the commit.
- `git commit -m "Describe what changed"` saves the changes locally with a short message.
- `git push` sends the commit to GitHub.

If this is the first time pushing a branch, use:

```bash
git push -u origin main
```

