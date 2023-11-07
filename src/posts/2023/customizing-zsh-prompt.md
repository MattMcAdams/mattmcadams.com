---
title: Customizing ZSH
date: 2023-11-05
published: true
series: false

tags: ['tutorial', 'command line']
description: "Creating a custom terminal experience is something of a rite of passage for software developers, especially those who use the terminal every day. In this post, I take a tour through my current setup."

thumbnail: https://mattmcadams.com/images/posts/customizing-zsh-prompt.png
cover_image: https://mattmcadams.com/images/posts/customizing-zsh-prompt.png
---

![screenshot of terminal](https://mattmcadams.com/images/posts/customizing-zsh-prompt.png)

While I was learning about terminal customization, I found that many websites tend to leap straight to projects like "oh-my-zsh" where you can choose from many pre-configured themes. Don't get me wrong, these projects are impressive and show how wildly flexible ZSH can be, but I wanted to *learn* something along the way. Since I learn best by doing, I wanted to explore and build my configuration by hand.

<div class="callout">
  I thank everyone who has made articles <a href="https://scriptingosx.com/2019/07/moving-to-zsh-06-customizing-the-zsh-prompt/" target="_blank">like this one</a> by Armin Briegel. While I borrow from and build on the shoulders of these developers, I do strive to understand exactly what the code is doing, and I will do my best to not only show the code but explain what it is and why.
</div>

For my prompt, I use [hyper](https://hyper.is/) with the [One Dark (Vivid) Theme](https://www.npmjs.com/package/hyper-one-dark-vivid).

## Aliases

We'll start with something simple, my list of aliases. I don't use the terminal so much that I need a lot of these, so I've focused on small quality of life shortcuts. You'll also find shortcuts for commands I forget all the time. I store these (and my functions) in an `_aliases.zsh` file I load into my `.zshrc` file.

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

On the topic of network related things, I also have an alias to show my local ip address, without all of the other information.

```shell
alias ip="curl ifconfig.me"
alias ip-wifi="ipconfig getifaddr en0"
alias ip-wired="ipconfig getifaddr en1"
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

You can find a [complete list of prompt escapes](https://zsh.sourceforge.io/Doc/Release/Prompt-Expansion.html) on the ZSH docs, including login information, shell state, date and time, formatting, and more.

Before we really get started on the prompt, I want to style my path. This involves a very complicated string.

```shell
# This sets up some fancier formatting for the path
ZSH_PROMPT_PATH='${${${${(%):-%~}/${(%):-%1~}/ %B${(%):-%1~}%b}/ %B${(%):-%-1~}%b/%B${(%):-%-1~}%b}//\//%B%F{cyan\}/%f%b}'
```

Breaking this down, `${(%):-%~}` is the full path, `${(%):-%1~}` is the last item in the path, `%B${(%):-%1~}%b` is the styled version of the last item. The slashes `/` perform a substitution "source/find/replace. Each time a substitution happens, the previous one must be wrapped in `${}` and the enture string has to be wrapped in `${}` as well. I save this path string to a variable `ZSH_PROMPT_PATH` so we can use it later. `%B` and `%b` styles the text as bold while `%F{color}` and `%f` sets the text color.

The end result is a path where the separators are bold cyan and the last folder in the path is bold.

For my personal prompt, I like having an empty line followed by the full path on it's own line, then my username the `@` symbol and the machine name. I also like having the time on the right side. To achieve this, I'll start by creating a function in my `.zshrc` file. This function will tell the prompt to print a blank line, then print the path using the `ZSH_PROMPT_PATH` variable we just made.

```shell
__prompt_precmd() {
  # Pass a line before each prompt
  print -P ''
  # Enable only for multiline prompt
  print -rP $ZSH_PROMPT_PATH
}
```

For this function to work, we need to load it into the precmd hook. You'll need to load `add-zsh-hook` first, then use our function to tell it what to do.

```shell
# Add precmd hooks
autoload -Uz add-zsh-hook
add-zsh-hook precmd __prompt_precmd
```

Now we get to the prompt line itself. `%n` displays the username and `%m` displays the machine name. Then I add a bold cyan arrow to signify the end of the prompt.

```shell
PROMPT="%n @ %m %B%F{cyan}❯%f%b "
```

Lastly, to add the time to the right side of the prompt, you can use `RPROMPT` and `%t`. You can put whatever information you like on the right side.

```shell
RPROMPT="%t"
```

<!-- I've made a whole post on [how to get and display the status of Git](/posts/2023/zsh-display-git) as part of the prompt, so I'll leave that bit off of this, as it is fairly complicated. -->

## Adding artwork

You can add character artwork or letters at the beginning of your terminal by echoing each line in your `.zshrc` file. At the time of writing, I use this cute cat and my initials to add a little bit of personality. Not that you'll need to escape some characters with `\`.

```shell
echo "   |\---/|"
echo "   | ,_, |"
echo "    \_'_/-..----.              ____ ___  ____ ___"
echo " ___/ '   ' ,--+ \            / __ \`__ \/ __ \`__ \\"
echo "(__...'   __\    |'.___.';   / / / / / / / / / / /"
echo "  (_,...'(_,.'__)/'.....+   /_/ /_/ /_/_/ /_/ /_/"
```

If you want to check out the full code used here, in addition to all of the other modifications I've made, check out my [dotfiles](https://github.com/MattMcAdams/dotfiles) on GitHub!
