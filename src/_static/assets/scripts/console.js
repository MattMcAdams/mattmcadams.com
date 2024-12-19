class SiteConsole {
  constructor() {
    // Detect if the console is open on load
    this.consoleOpen =
      localStorage.getItem("consoleOpen") === "true" ? true : false;
    // Check the history every time this.history is referenced
    this.history = this.getHistory();
    // Get the user's name from local storage or set to "guest"
    this.name = localStorage.getItem("consoleName") || "guest";
    // Bind the method to the instance
    this.doCommand = this.doCommand.bind(this);
    // Run the initialization function
    this.init();
  }

  commands = {
    clear: Object.assign(() => {
        this.clearHistory();
        return;
      }, {
      help: "Clear the console history",
    }),
    su: Object.assign((command) => {
        const name = command.split(" ")[1];
        if (!name) {
          this.addHistory("error", "Missing required argument `name`", "system");
          return;
        }
        this.name = name;
        localStorage.setItem("consoleName", name);
        this.addHistory("response", `Logged in as ${name}`, "system");
        return;
      }, {
      help: "Set the username for the console. Syntax: su [name]"
    }),
    logout: Object.assign(() => {
        localStorage.removeItem("consoleName");
        this.name = "guest";
        this.addHistory("response", "Logged out", "system");
        return;
      }, {
      help: "Log out of the console and set the username to default",
    }),
    echo: Object.assign((command) => {
        const content = command.split(" ").slice(1).join(" ");
        if (!content) {
          this.addHistory("error", "Missing required argument `content`", "system");
          return;
        }
        this.addHistory("response", content, this.name);
        return;
      }, {
      help: "Print the content of the command. Syntax: echo [content]",
    }),
    sudo: Object.assign(() => {
        this.addHistory("error", "Insufficient permissions", "root");
        return;
      }, {
      help: "Execute a command as root. Syntax: sudo [command]",
    }),
    whoami: Object.assign(() => {
        this.addHistory("response", this.name, "system");
        return;
      }, {
      help: "Print the current username",
    }),
    date: Object.assign(() => {
        this.addHistory("response", new Date().toLocaleString(), "system");
        return;
      }, {
      help: "Print the current date and time",
    }),
  }

  // Markup for the console prompt header
  consolePrompt(user) {
    return `<strong>
      ${user ? user : this.name}&nbsp;@&nbsp;mattmcadams.com&nbsp;❯&nbsp;
    </strong>`;
  }

  // Get the history from local storage and parse it
  getHistory() {
    const rawHistory = localStorage.getItem("consoleHistory") || "[]";
    return JSON.parse(rawHistory);
  }

  // Save the history to local storage
  saveHistory() {
    localStorage.setItem("consoleHistory", JSON.stringify(this.history));
  }

  // Clear the history from local storage and the object
  clearHistory() {
    localStorage.removeItem("consoleHistory");
    this.history = [];
  }

  // Add an item to the history
  addHistory(type, content, user) {
    if (!content) {
      console.error("Missing required argument `content` for addHistory");
      return false;
    }
    if (!type) {
      console.error("Missing required argument `type` for addHistory");
      return false;
    }
    if (type !== "command" && type !== "response" && type !== "error") {
      console.error("Invalid value for `type` in addHistory");
      return false;
    }
    // Construct the object to add to the history
    const obj = {
      type: type,
      content: content,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      user: user,
    };
    // Push the object to local history and save it
    this.history.push(obj);
    this.saveHistory();
    return true;
  }

  // Return the history feed as HTML
  printHistory() {
    let content = "";
    for (let item of this.history) {
      if (item.type === "command") {
        content += `
        <p class="console_history-line--command">
          <span class="console_history_prompt">${this.consolePrompt(
            item.user
          )}</span>
          <span class="console_history_content">${item.content}</span>
          <span class="console_history_timestamp">${item.timestamp}</span>
        </p>`;
      } else if (item.type === "response") {
        content += `
        <p class="console_history-line--response">
          <span class="console_history_content">${item.content}</span>
        </p>`;
      } else if (item.type === "error") {
        content += `
        <p class="console_history-line--error">
          <span class="console_history_error"><strong>!</strong></span>
          <span class="console_history_content">${item.content}</span>
        </p>`;
      }
    }
    return content;
  }

  sanitizeInput(input) {
    const element = document.createElement("div");
    element.innerText = input;
    return element.innerHTML;
  }

  doCommand(event) {
    // Stop page from reloading
    event.preventDefault();
    // Abort if the console isn't open
    if (!this.consoleOpen) return;
    // Get the history element and the input value, then clear the input
    const historyElement = document.getElementById("consoleHistory");
    const input = event.target.querySelector("input");
    const command = this.sanitizeInput(input.value.toString().trim());
    input.value = "";
    // Get the first word of the command
    const firstWord = command.split(" ")[0];
    // Add the command to the history
    this.addHistory("command", command, this.name.toString());
    if (firstWord === 'mkdir' || firstWord === 'touch') {
      this.addHistory("error", "Insufficient permissions", "system");
      this.addHistory(
        "response",
        "If you'd like to modify this site, <a href='https://github.com/MattMcAdams/mattmcadams.com'>open a PR on github</a>.",
        "system"
      );
    } else if (firstWord in this.commands) {
      this.commands[firstWord](command);
    } else if (firstWord === "help") {
      // The help command has to be hard coded into the doCommand method
      // Check to see if there are too many arguments
      if (command.split(" ").length > 2) {
        this.addHistory("error", "Too many arguments for help", "system");
      } else if (command.split(" ").length === 1) {
        // List the available commands if no arguments are provided
        let helpText = "<strong>Available Commands:</strong><br>";
        for (let cmd in this.commands) {
          helpText += `- ${cmd}<br>`;
        }
        helpText += "Use 'help [command]' for more information";
        this.addHistory("response", helpText, "system");
      } else if (command.split(" ").length === 2) {
        const helpCommand = command.split(" ")[1];
        // Check to see if the command exists
        if (helpCommand in this.commands) {
          // Return that command's help text
          this.addHistory(
            "response",
            `${this.commands[helpCommand].help}`,
            "system"
          );
        } else {
          // Otherwise return an error
          this.addHistory(
            "error",
            `Command not recognized: '${helpCommand}'`,
            "system"
          );
        }
      }
    } else {
      this.addHistory(
        "error",
        `Command not recognized: '${firstWord}'`,
        "system"
      );
    }
    this.openConsole();
  }

  openConsole() {
    const parent = document.getElementById("console");
    parent.innerHTML = `
    <div id="consoleHistory">${this.printHistory()}</div>
    <form style="display: flex;" method="post">
      <span aria-hidden="true">${this.consolePrompt()}</span>
      <label for="consoleInput" class="visually-hidden">console</label>
      <input type="text" spellcheck="false" name="consoleInput" id="consoleInput"></input>
      <span aria-hidden="true" style="min-width: max-content">&nbsp;${new Date().toLocaleTimeString(
        [],
        { hour: "2-digit", minute: "2-digit" }
      )}</span>
    </form>`;
    parent.setAttribute("aria-expanded", true);
    parent.querySelector("input").focus();
    parent.querySelector("form").addEventListener("submit", this.doCommand);
    localStorage.setItem("consoleOpen", true);
    this.consoleOpen = true;
    const historyElement = document.getElementById("consoleHistory");
    historyElement.scrollTop = historyElement.scrollHeight;
    return true;
  }

  closeConsole() {
    const parent = document.getElementById("console");
    parent.innerHTML = "";
    parent.setAttribute("aria-expanded", false);
    localStorage.setItem("consoleOpen", false);
    this.consoleOpen = false;
    return false;
  }

  init() {
    const parent = document.getElementById("console");
    document.addEventListener("keydown", (event) => {
      if (event.ctrlKey && event.key === "`") {
        this.consoleOpen ? this.closeConsole() : this.openConsole();
        if (this.consoleOpen) {
          parent.querySelector("input").focus();
        }
      }
      if (event.key === "Escape") {
        this.closeConsole();
      }
    });
    if (this.consoleOpen) {
      this.openConsole();
      parent.addEventListener("click", (event) => {
        if (event.target.id !== "consoleInput") {
          parent.querySelector("input").focus();
        }
      });
    }
  }
}

window.onload = () => new SiteConsole();
