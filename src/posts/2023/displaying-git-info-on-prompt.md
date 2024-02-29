---
title: Displaying Git info on the command prompt
date: 2023-12-01

tags: ['tutorial', 'command line']
description: "Let's look at how to display Git information as a part of the ZSH prompt."

thumbnail: /images/posts/2023/git-prompt-info.png
cover_image: /images/posts/2023/git-prompt-info.png
---

In my previous post, I looked at [ways to customize the ZSH prompt](/posts/2023/customizing-zsh-prompt/). Now let's take it a bit further and show some version control information on the right side of the prompt as well.

![Screenshot of terminal with git info](/images/posts/2023/git-prompt-info.png)

First let's set up support for the version control system. To do this, we need to autoload the version control system with `autoload -Uz vcs_info`. Then we'll need to wrap that in a function and add that function to the builtin `precmd_functions`.

```shell
autoload -Uz vcs_info
precmd_vcs_info() { vcs_info }
precmd_functions+=( precmd_vcs_info )
```

We also need to tell the prompt string to first be subjected to parameter expansion, command substitution and arithmetic expansion. We do this with `setopt prompt_subst`. We need another line to let us style the git information.

```shell
setopt prompt_subst
zstyle ':vcs_info:git:*' formats '%b'
```

## Goals

Let's consider these goals as we work through displaying git information.

- Display the number of non-committed files with changes
- Display the number of commits the local branch is behind from origin
- Display the number of commits the local branch is ahead of origin
- Indicate if there are stashed changes
- Indicate if there is no tracking branch
- Indicate if the tracking branch has been deleted

## The git_prompt_status function

Now for the hard part, we need to use a variety of git commands to get information about git's status. I'm going to wrap all of this in a function called `__git_prompt_status()` so keep in mind from this point forward, we'll be working inside this function.

First, we'll define some local veriables.

```shell
local INDEX TRACKING AHEAD BEHIND STATUS EDITS
```

Next, initialize the `STATUS` variable. This is where we'll store the string we want to display on the prompt.

```shell
STATUS=""
```

### Indicating stashed commits

For my use case, I don't care to know the number of stashes, only if a stash exists. We can do this by printing each stash entry and checking to see if anything is returned.

We'll then add to the STATUS a cyan return icon `↩︎`.

```shell
if $(command git rev-parse --verify refs/stash &>/dev/null); then
  STATUS="%F{cyan}↩︎%f $STATUS"
fi
```

### Displaying tracking info

To display if the local branch is tracking a deleted branch, or no branch at all, we'll need to set up a variable `TRACKING`. Then, to see how many commits the branch is ahead or behind, we need to set up the variables `AHEAD` and `BEHIND`.

Tracking will print a message from git that we can use later. If no upstream branch is found, the message will be `fatal: no upstream configured for branch 'BRANCH NAME'`. If the upstream branch has been deleted, the message will start with `fatal: ambiguous argument '@{upstream}': unknown revision or path not in the working tree.`. Otherwise the message will equal the name of the upstream branch.

Breaking down ahead and behind, the git command here will print the commit hash for each commit the branch is behind or ahead by. We can take this and count the lines, then remove extra space.

```shell
TRACKING=$(git rev-parse --abbrev-ref @{upstream} 2>&1)
AHEAD=$(git rev-list HEAD@{upstream}..HEAD 2> /dev/null | wc -l | awk '{$1=$1};1')
BEHIND=$(git rev-list HEAD..HEAD@{upstream} 2> /dev/null | wc -l | awk '{$1=$1};1')
```

We can use this tracking message and look for some specific language git uses in it's message.

Check if there is no upstream by searching the return for "no upstream". In this case, I want to display a yellow house icon `⌂` in the first part of the status.

Te detect if the upstream has been deleted, search the return for "@{upstream}" In this case, I want to display a red exclamation point `!` in the first part of the status.

```shell
if $(echo "$TRACKING" | grep 'no upstream' &> /dev/null); then
  STATUS="%F{yellow}⌂%f $STATUS"
elif $(echo "$TRACKING" | grep '@{upstream}' &> /dev/null); then
  STATUS="%B%F{red}!%f%b $STATUS"
```

If neither of those points are true, we can continue to see how far behind and/or ahead the branch is. This section will say if `AHEAD` is greater than 0, display the number of commits the branch is ahead along with a green up arrow `↑`. Additionally, if `BEHIND` is greater than 0, display the number of commits the branch is behind along with a red down arrow `↓`

This is the second and final part of the if statement we started above.

```shell
else
  if [[ $AHEAD -gt 0 ]]; then
    STATUS="$STATUS$AHEAD%F{green}↑%f "
  fi
  if [[ $BEHIND -gt 0 ]]; then
    STATUS="$STATUS$BEHIND%F{red}↓%f "
  fi
fi
```

### Displaying uncommitted changes

Lastly, we need to set up the variable `INDEX`, which stores a response from git which prints each uncommitted file with changes to it's own line. We'll use this variable to setup `EDITS` to store the number of uncommitted changes.

```shell
INDEX=$(git status --porcelain 2> /dev/null)
EDITS=$(echo $INDEX | wc -l | awk '{$1=$1};1')
```

Now to display the number of edits with a bold, blue asterisk `*` at the end of the status.

```shell
if [[ ! -z "$INDEX" ]]; then
  STATUS="$STATUS$EDITS%B%F{blue}*%f%b "
fi
```

### Returning the status string

The last step is to return the status string if it's not empty.

```shell
if [[ ! -z "$STATUS" ]]; then
  echo "$STATUS"
fi
```

### Putting it all together

```shell
__git_prompt_status() {
  local INDEX TRACKING AHEAD BEHIND STATUS EDITS

  INDEX=$(git status --porcelain 2> /dev/null)
  TRACKING=$(git rev-parse --abbrev-ref @{upstream} 2>&1)
  AHEAD=$(git rev-list HEAD@{upstream}..HEAD 2> /dev/null | wc -l | awk '{$1=$1};1')
  BEHIND=$(git rev-list HEAD..HEAD@{upstream} 2> /dev/null | wc -l | awk '{$1=$1};1')
  STATUS=""
  EDITS=$(echo $INDEX | wc -l | awk '{$1=$1};1')

  if $(command git rev-parse --verify refs/stash &>/dev/null); then
    STATUS="%F{cyan}↩︎%f $STATUS"
  fi

  if $(echo "$TRACKING" | grep 'no upstream' &> /dev/null); then
    STATUS="%F{yellow}⌂%f $STATUS"
  elif $(echo "$TRACKING" | grep '@{upstream}' &> /dev/null); then
    STATUS="%B%F{red}!%f%b $STATUS"
  else
    if [[ $AHEAD -gt 0 ]]; then
      STATUS="$STATUS$AHEAD%F{green}↑%f "
    fi
    if [[ $BEHIND -gt 0 ]]; then
      STATUS="$STATUS$BEHIND%F{red}↓%f "
    fi
  fi

  if [[ ! -z "$INDEX" ]]; then
    STATUS="$STATUS$EDITS%B%F{blue}*%f%b "
  fi

  if [[ ! -z "$STATUS" ]]; then
    echo "$STATUS"
  fi
}
```

## Displaying the status on the prompt

This is all well and good, but all we've done is create a function that echos the git information. First, we have to make sure we're in a directory with version control. I created this function to handle that, display the branch name followed by the branch status, all wrapped in brackets.

```shell
__prompt_git_info() {
  [ ! -z "$vcs_info_msg_0_" ] && echo "[ $vcs_info_msg_0_ $(__git_prompt_status)]"
}
```

I like to display the git information to the right of my prompt, so we'll assign the function to the builtin `RPROMPT` variable. I also added a timestamp with `%t`.

```shell
RPROMPT='$(__prompt_git_info) %t'
```
