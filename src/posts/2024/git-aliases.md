---
title: Useful Git Aliases
date: 2024-08-03

tags: ['git']
description: "Over the years, I've collected several invaluable aliases for Git. In this article, I go over each one and what they do and why its helpful."

thumbnail: null
cover_image: null
---

My setup is a bit unique because I manage most of my setting through my [dotfiles](https://github.com/MattMcAdams/dotfiles) system. That shouldn't matter too much though, as today we're just looking at a few aliases for Git.

## Show verbose output about tags, branches or remotes

These three aliases are incredibly useful for reference when you can't remember the exact name of a branch, remote, or tag.

```txt
tags = tag -l
branches = branch --all
remotes = remote --verbose
```

Simple enough, `tags` will list each tag in the current repo, `branches` will list the name of every branch, and `remotes` will list the name of every remote.

## List all configuration settings

Sometimes its helpful to see the current git configuration. You can do this with `config --list` but I've set up an alias for that to just be `configs`. You'll notice a pattern of making a command plural to get a list.

```txt
configs = config --list
```

## List all aliases

Sometimes I forget what keyword I set up for a certain alias, so this is helpful to find those. This is similar to my ZSH aliases for listing all custom aliases.

```txt
aliases = config --get-regexp alias
```

## List contributors with number of commits

If you ever want to see who all has contributed to a repository, this is a helpful alias. Keep in mind that commits are associated with your git config Name, so if you've set that up differently over the years you may see your name multiple times!

```txt
contributors = shortlog --summary --numbered
```

## Show the user email for the current repository

To quickly find out what email address is associated with your commits, you can make use of the `whoami` alias.

```txt
whoami = config user.email
```

## Amend the currently staged files to the latest commit

This is helpful if you forget something that should have been in the last commit, just remember to amend before you push to a remote repo!

```txt
amend = commit --amend --reuse-message=HEAD
```

## Undo the last commit, keeping changes in the working directory

If you didn't mean to make the commit at all, you can revert the commit while keeping the work you did on it. I find this particularly useful when a commit is made on the wrong branch. It can quickly be recalled, stashed, and popped into a new branch.

```txt
uncommit = reset --soft HEAD~1
```

## Unstage all files in the working directory

This is just a helpful utility to unstage any staged files.

```txt
unstage  = reset HEAD
```

## Clean the working directory by removing untracked files and uncommitted changes

If you've messed up and just need a clean slate, this alias can help by removing all untracked files and changes so that the working directory matches the last commit.

```txt
cleanout = !git clean -df && git checkout -- .
```

## Reset to origin

Taking it a step further, this will also remove any commits that have not yet been pushed. This can be helpful if you were working on an idea, made several commits, then realized the idea won't work for whatever reason. Or if your git gets messed up in a way that it just needs to be reset to whats on origin.

```txt
reset-origin = ! "git fetch origin && git reset --hard origin/$(git rev-parse --abbrev-ref HEAD)"
```

## Add & Commit at the same time

I find myself typing `git add . && git commit -m ""` a lot, so I made an alias to do both at once.

```txt
add-commit = ! "git add . && git commit -m"
```

## Delete local branches that were deleted from remote

Probably my most used alias. This is helpful when you often delete branches from the remote repo, such as on GitHub after merging a pull request. This alias will look for all branches that no longer exist on origin and delete them. Credit for this goes to [Erik Schierboom](https://www.erikschierboom.com/2020/02/17/cleaning-up-local-git-branches-deleted-on-a-remote/)!

```txt
prune-branches = ! "git fetch -p && git for-each-ref --format '%(refname:short) %(upstream:track)' | awk '$2 == \"[gone]\" {print $1}' | xargs -r git branch -D"
```

## Pretty display for git log

If you use the git log often, this is a great way to display it. It includes the first 7 of the commit SHA, committer name, message, and how long ago the commit was, all with a visual graph on the side to show branch relationships.

```txt
log-pretty = "log --graph --pretty=format:'%Cred%h%Creset %an: %s - %Creset %C(yellow)%d%Creset %Cgreen(%cr)%Creset' --abbrev-commit --date=relative"
```

## Search for a string in the commit history

Honestly I don't use this that often, but it can be really helpful for finding the SHA of a specific commit by searching for a string in the commit message. It can also be useful for finding a lot of similar commits.

```txt
search = "!f() { git log --all --grep=\"$1\"; }; f"
```

## Find full SHA when you have part of it

Sometimes you need to find the full commit SHA for a given commit but may only have the first few characters of it, maybe from log-pretty or copied from a service like GitHub. I can never remember the `rev-parse` command, so I created a more easy to remember alias.

```txt
find = "rev-parse"
```

## Squash the last n commits into one

This can be helpful if you often squash commits. Remember not to squash commits that have already been sent to origin though.

```txt
squash = "!f() { git rebase -i HEAD~$1; }; f"
```

## Init repo with contents of current directory

I usually create repositories from GitHub or other origin, but this is still a nice timesaver for getting a repo up and running on the local machine.

```txt
init-repo = "!f() { git init && git add . && git commit -m 'Initial commit'; }; f"
```

## Install all git submodules

This is great not only for installing submodules but for resetting them to the version specified by your repository.

```txt
module-install = "submodule update --init --recursive"
```

## Updating all git submodules

When you want to actually update a submodule to it's latest commit, you can use this alias.

```txt
module-update = "submodule update --remote --merge"
```

## Conclusion

Remember that aliases are just tools to help you remember or more quickly execute certain commands. Are there any commands you struggle to remember? Or any neat aliases you've come across? I'm always interested in little things like this so let me know!
