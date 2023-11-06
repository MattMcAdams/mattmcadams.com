---
title: My ZSH Terminal
date: 2023-11-05
published: true
series: false

tags: ['tutorial']
description: "Creating a custom terminal experience is something of a rite of passage for software developers, especially those who use the terminal every day. In this post, I take a tour through my current setup."

thumbnail: null
cover_image: null
---

## Aliases

We'll start with something simple, my list of aliases. These are short and simple. I don't use the terminal so much that I need a lot of these, so I've focused on small quality of life shortcuts. You'll also find shortcuts for commands I forget all the time.

### Listing customizations

My first set of aliases just lists various customizations I've made. `aliases` lists all of my aliases, `functions` lists my functions, and `paths` lists all paths being loaded.

```shell
alias aliases="alias | sed 's/=.*//'"
alias functions="declare -f | grep '^[a-z].* ()' | sed 's/{$//'"
alias paths='echo -e ${PATH//:/\\n}'
```

### Utilities

For some reason, I always have to look up how to make a script executable, so I made a shortcut `make-exe` to help me remember. I also forget how to create a symbolic link, so I made `symlink` and while this is more to type out, it keeps me from forgetting it. Lastly, I never know when I'll be required to use `sudo` so I made an alias `please` to rerun the last command with sudo.

```shell
alias symlink="ln -s"
alias make-exe="chmod 700"
alias please="sudo !!"`
```

Next, as a web developer, sometimes I have to mess with my hosts file. I made `host-edit` and `clean-dns` to make that easier.

```shell
alias host-edit="sudo -b /System/Applications/TextEdit.app/Contents/MacOS/TextEdit /etc/hosts"
alias clean-dns="sudo killall -HUP mDNSResponder"
```

On the topic of network related things, I also have an alias to show my ip address, `ip`, and my local ip address, `ipl`.

```shell
alias ip="curl ifconfig.me --silent"
alias ipl="ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1'"
```

### What version am I running?

I ask this question a lot and depending on the software, the command could be different. Most seem to use `-v` but others require you to write out `-version` so I made a function to help me remember. This way, I can type `version name` where name is the command I want to know about.

```shell
function version {
  if [ "$1" = "git" ]
  then
    git --version
  elif [ "$1" = "node" ]
  then
    node -v
  elif [ "$1" = "npm" ]
  then
    npm -v
  elif [ "$1" = "php" ]
  then
    php -v
  elif [ "$1" = "composer" ]
  then
    composer -V
  else
    echo "Options: [git, node, npm, php, composer]"
  fi
}
```

## The prompt

This is the most complicated part of my terminal setup. First, I want to display my path in a pretty format. We're going to use some heavy regex to format.

```shell
# This sets up some fancier formatting for the path
ZSH_PROMPT_PATH='${${${${(%):-%~}/${(%):-%1~}/ %B${(%):-%1~}%b}/ %B${(%):-%-1~}%b/%B${(%):-%-1~}%b}//\//%B%F{cyan\}/%f%b}'
```

Breaking this down, `${(%):-%~}` is the full path, `${(%):-%1~}` is the last item in the path, `%B${(%):-%1~}%b` is the styled version of the last item. The slashes `/` perform a substitution "source/find/replace. Each time a substitution happens, the previous one must be wrapped in `${}` and the enture string has to be wrapped in `${}` as well. I save this path string to a variable `ZSH_PROMPT_PATH` so we can use it later.

Next, I want to print an empty line and the current path before each command. To do this, I'll create a function and use a hook to execute it before each prompt.

```shell
__prompt_precmd() {
  # Pass a line before each prompt
  print -P ''
  # Enable only for multiline prompt
  print -rP $ZSH_PROMPT_PATH
}

# Add precmd hooks
autoload -Uz add-zsh-hook
add-zsh-hook precmd __prompt_precmd
```

### Git Information

For the right side of my prompt, I want to display the git branch and status. Let's start with the branch, we'll create a function to get the information from version control.

```shell
__prompt_git_branch() {
  autoload -Uz vcs_info
  precmd_vcs_info() { vcs_info }
  precmd_functions+=( precmd_vcs_info )
  setopt prompt_subst
  zstyle ':vcs_info:git:*' formats '%b'
}
```

Next we'll work on getting the git status. There's a few things I'm interested in knowing:

- If I'm working on a local branch
- If I'm working on a pruned branch
- If there are uncommitted changes
- If there are changes in my git stash
- If I'm behind origin and need to pull
- If I'm ahead of origin and need to push

We'll start by making a function and setting a few variables. These variables will get information from git that we can use to make comparisons with, this will ultimately indicate the desired git statuses.

```shell
__git_prompt_status() {
  local INDEX TRACKING AHEAD BEHIND STATUS EDITS

  INDEX=$(git status --porcelain 2> /dev/null)
  TRACKING=$(git rev-parse --abbrev-ref @{upstream} 2>&1)
  AHEAD=$(git rev-list HEAD@{upstream}..HEAD 2> /dev/null | wc -l | awk '{$1=$1};1')
  BEHIND=$(git rev-list HEAD..HEAD@{upstream} 2> /dev/null | wc -l | awk '{$1=$1};1')
  STATUS=""
  EDITS=$(echo $INDEX | wc -l | awk '{$1=$1};1')
```

Next, let's determine if there are changes in the stash. This will print a lovely cyan return arrow.

```shell
if $(command git rev-parse --verify refs/stash &>/dev/null); then
  STATUS="%F{cyan}↩︎%f $STATUS"
fi
```

Now we'll get some information about the branch. We can immediately find out if we're working on a local branch by seeing if git reports no upstream. This will print a yellow house icon. If the branch has been deleted on the upstream, we'll display a red exclamation point.

If the upstream is good, we'll look to see if branch is ahead or behind or both. Ahead will get a green up arrow and behind will get a red down arrow, along with the number of commits ahead and/or behind. Note that I'm slowing building up the `STATUS` variable with these icons.

```shell
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
```

Lastly, we'll find out if there are uncommitted changes on the branch. This will display a blue asterisk icon, along with the number of edits made.

```shell
if [[ ! -z "$INDEX" ]]; then
  STATUS="$STATUS$EDITS%B%F{blue}*%f%b "
fi
```

#### Putting it all together

Now we'll use another function to check if we're on a git branch, and if so, print the branch and status.

```shell
__prompt_git_info() {
  [ ! -z "$vcs_info_msg_0_" ] && echo "[ $vcs_info_msg_0_ $(__git_prompt_status)]"
}
```

Finally, we'll display the git status on the right side of the prompt, along with the time. We'll also stylize the left side of the prompt. I like it to display my username and the machine name.

```shell
# Format git branch and general git support
__prompt_git_branch
# Display the git status and time on the right side of the prompt
RPROMPT='$(__prompt_git_info) %t'
PROMPT="%n @ %m %B%F{cyan}❯%f%b "
```

## Other neat tools

- You can install [VS Code's CLI](https://code.visualstudio.com/docs/editor/command-line) to open any file in VS Code with `code path/to/file`
- With [NPM Serve](https://www.npmjs.com/package/serve), you can serve a directory as a webpage with `serve`

If you want to check out the full code used here, check out my [dotfiles](https://github.com/MattMcAdams/dotfiles)!
