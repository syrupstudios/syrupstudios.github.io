// Declare global variables
var _a1Zb3 = "root";             // Original: key1
var _b2Yx9 = false;              // Original: key2
var _c3Pq7 = true;               // Original: key3

var _d4Wv1 = _a1Zb3;             // Original: root_password
var _e5Ht2 = _b2Yx9;             // Original: isUnlocked
var _f6Lu8 = _c3Pq7;             // Original: SANDBOX_EXECUTION_ENABLED
let isSandboxOpen = false;       


// Function to load a file and run a callback after loading
function loadFile(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    // Evaluate the script received from config.js
                    eval(xhr.responseText);

                    // Run the callback after loading the config
                    callback();
                } catch (e) {
                    console.error('Error evaluating config:', e);
                    // Reinitialize with default values in case of evaluation errors
                    initializeConfig();
                }
            } else {
                console.error('Failed to load config, status:', xhr.status);
                // Reinitialize with default values if the request fails
                initializeConfig(xhr.status);
            }
        }
    };

    xhr.send();
}

// Function to initialize configuration values
function initializeConfig(xhr) {
    if (window.config) {
      _a1Zb3 = window.config.root_password; 
      _b2Yx9 = window.config.consoleRootUnlocked_ByDefault;
      _c3Pq7 = window.config.sandbox_execution_enabled;

        // Initialize the global variables
        _d4Wv1 = _a1Zb3;
        _e5Ht2 = _b2Yx9;
        _f6Lu8 = _c3Pq7;
        
        if (_b2Yx9 === true) {
          console.warn("Unlocking your console by default makes you website vulnerable to attackers.")
        }
    } else if (xhr === 404) {
        console.error('Config object not found, using default values.');
        console.warn('Your website could be vulnerable to attacks while your console uses default values please create a "config.js" file. To run commands on root please  use the "root_auth" command, the root password is "root".');
    } else if (xhr === 0) {
      console.error('Config object not found, using default values.');
      console.warn('Your config file may exist but could not be accessed, this is most likely becuase your running in a local environment. e.g. from your html file. Default config values have been applied! To run commands on root please  use the "root_auth" command, the root password is "root".');
  } else {
    console.error('Config object not found, using default values.');
    console.error('An unknown error loading or accessing you config file has occurred. Default config values have been applied! To run commands on root please  use the "root_auth" command, the root password is "root".');
} 
}

// Load configuration and initialize variables
loadFile('console/config/console-config.js', initializeConfig);

// Buffer to store messages before the console is created
const messageBuffer = [];

// Function to log messages to the custom console
function logToConsole(message, type = "log") {
  const consoleElement = document.getElementById("custom-console");
  if (!consoleElement) {
    // If console is not open, buffer the message
    messageBuffer.push({ type, message });
    return;
  }

  const outputArea = consoleElement.querySelector("#output-area");
  const messageElement = document.createElement("div");
  messageElement.style.padding = "5px";
  messageElement.style.borderRadius = "5px";
  messageElement.style.marginBottom = "2px";

  // Set background color based on message type
  if (type === "success") {
    messageElement.style.backgroundColor = "#4caf5080"; // Darker green background for successful password log
    messageElement.style.color = "#ffffff"; // Text color for better contrast
  } else {
    messageElement.style.backgroundColor =
      type === "log"
        ? "#2b2b3a" // Default background for 'log'
        : type === "warn"
        ? "#f5c53280" // Background for 'warn' (dark yellow)
        : "#e74c3c80"; // Background for 'error' (dark red)
    messageElement.style.color = "#f8f8f2"; // Text color for other logs
  }

  messageElement.textContent = message;
  outputArea.appendChild(messageElement);
  outputArea.scrollTop = outputArea.scrollHeight;
}

// Override console methods to capture logs, errors, and warnings
["log", "error", "warn"].forEach((method) => {
  const original = console[method];
  console[method] = function (...args) {
    // Call the original console method
    original.apply(console, args);

    // Store messages in the buffer with the type
    const message = args.join(" ");
    logToConsole(message, method);
  };
});

// Keybind to open or close the console (Ctrl + Alt + D)
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.altKey && e.key === "d") {
    e.preventDefault();
    toggleConsole();
  }
});

function toggleConsole() {
  const existingConsole = document.getElementById("custom-console");
  if (existingConsole) {
    existingConsole.remove(); // Close the console if it's already open
  } else {
    createConsole(); // Create the console if it's not open
  }
}

function createConsole() {
  // Create console elements
  const consoleWindow = document.createElement("div");
  consoleWindow.id = "custom-console";
  consoleWindow.style = `
    position: fixed;
    top: 20px; /* Added to initialize top position */
    left: 20px; /* Added to initialize left position */
    width: 600px;
    height: 350px;
    background: #1e1e2f;
    color: #f8f8f2;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    z-index: 10000;
    resize: both;
    overflow: hidden;
`;

  const header = document.createElement("div");
  header.style = `
        display: flex;
        align-items: center;
        background: #343449;
        padding: 10px;
        cursor: move;
        color: #ffffff;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        user-select: none;
    `;

  const title = document.createElement("div");
  title.style = `
        flex-grow: 1;
        text-align: left;
        font-size: 16px;
        font-weight: bold;
    `;
  title.innerText = "Developer Console";

  const closeButton = document.createElement("div");
  closeButton.style = `
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #4b4b7f; /* Color matching the console theme */
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 14px;
        user-select: none;
        margin-left: 10px;
    `;
  closeButton.innerText = "×"; // Close icon
  closeButton.title = "Close";

  closeButton.addEventListener("click", () => {
    consoleWindow.remove(); // Close the console when the button is clicked
  });

  header.appendChild(title);
  header.appendChild(closeButton);
  consoleWindow.appendChild(header);

  const outputArea = document.createElement("div");
  outputArea.id = "output-area"; // Add ID to the output area
  outputArea.style = `
        flex-grow: 1;
        padding: 10px;
        overflow-y: auto;
        background: #1e1e2f;
        border-top: 1px solid #444;
        border-bottom: 1px solid #444;
        scrollbar-width: thin;
        scrollbar-color: #4b4b7f #1e1e2f;
    `;

  const inputArea = document.createElement("input");
  inputArea.type = "text";
  inputArea.id = "console-input"; // Added ID for the input
  inputArea.style = `
        width: 100%;
        padding: 10px;
        border: none;
        outline: none;
        box-sizing: border-box;
        background: #2b2b3a;
        color: #f8f8f2;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    `;
  inputArea.placeholder = "Enter JavaScript code or type 'help' for commands.";

  consoleWindow.appendChild(outputArea);
  consoleWindow.appendChild(inputArea);
  document.body.appendChild(consoleWindow);

  // Make the console draggable
  makeDraggable(consoleWindow, header);

  // Display the initial welcome message
  logToConsole(
    "welcome to the developer console! type javaScript commands below and press enter to execute."
  );
  logToConsole("type 'help' for a list of available commands.");

  // Display buffered messages
  messageBuffer.forEach(({ type, message }) => logToConsole(message, type));

  // Run commands or JavaScript code from input
  inputArea.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const input = inputArea.value.trim();
      inputArea.value = "";
      if (input) handleInput(input, "main");
    }
  });
}

// Function to create a sandbox console with JavaScript execution
function createSandboxConsole() {
  isSandboxOpen = true;
  // Create sandbox console elements
  const sandboxConsole = document.createElement("div");
  sandboxConsole.id = "sandbox-console";
  sandboxConsole.style = `
    position: fixed;
    top: 80px; /* Added to initialize top position */
    left: 80px; /* Added to initialize left position */
    width: 600px;
    height: 350px;
    background: #1e1e2f;
    color: #f8f8f2;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    z-index: 10000;
    resize: both;
    overflow: hidden;
`;

  const header = document.createElement("div");
  header.style = `
        display: flex;
        align-items: center;
        background: #343449;
        padding: 10px;
        cursor: move;
        color: #ffffff;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        user-select: none;
    `;

  const title = document.createElement("div");
  title.style = `
        flex-grow: 1;
        text-align: left;
        font-size: 16px;
        font-weight: bold;
    `;
  title.innerText = "Sandbox";

  const closeButton = document.createElement("div");
  closeButton.style = `
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #4b4b7f; /* Color matching the console theme */
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 14px;
        user-select: none;
        margin-left: 10px;
    `;
  closeButton.innerText = "×";
  closeButton.title = "Close";

  closeButton.addEventListener("click", () => {
    logToConsole("sandbox closed.", "log");
    isSandboxOpen = false;
    sandboxConsole.remove();
  });

  header.appendChild(title);
  header.appendChild(closeButton);
  sandboxConsole.appendChild(header);

  const outputArea = document.createElement("div");
  outputArea.id = "sandbox-output-area";
  outputArea.style = `
        flex-grow: 1;
        padding: 10px;
        overflow-y: auto;
        background: #1e1e2f;
        border-top: 1px solid #444;
        border-bottom: 1px solid #444;
        scrollbar-width: thin;
        scrollbar-color: #4b4b7f #1e1e2f;
    `;

  const iframe = document.createElement("iframe");
  iframe.id = "sandbox-iframe";
  iframe.style = `
        width: 100%;
        height: 75%;
        border: 2px solid #2b2b3a;
        background: #fff;
    `;

  const inputArea = document.createElement("input");
  inputArea.type = "text";
  inputArea.id = "sandbox-input";
  inputArea.style = `
        width: 100%;
        padding: 10px;
        border: none;
        outline: none;
        box-sizing: border-box;
        background: #2b2b3a;
        color: #f8f8f2;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    `;
  inputArea.placeholder = "Enter JavaScript code here.";

  sandboxConsole.appendChild(outputArea);
  sandboxConsole.appendChild(iframe);
  sandboxConsole.appendChild(inputArea);
  document.body.appendChild(sandboxConsole);

  // Make the sandbox console draggable
  makeDraggable(sandboxConsole, header);

  // Display the initial welcome message in the sandbox console
  const welcomeMessage = _f6Lu8
    ? "welcome to the sandbox console! type javascript commands below and press enter to execute."
    : "the sandbox console is unavailable. code will not execute.";
  logToSandboxConsole(welcomeMessage, "log");

  // Run commands or JavaScript code from input
  inputArea.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const input = inputArea.value.trim();
      inputArea.value = "";
      if (input) handleSandboxInput(input);
    }
  });
}

// Log messages specifically in the sandbox console
function logToSandboxConsole(message, type = "log") {
  const outputArea = document.getElementById("sandbox-output-area");
  const messageElement = document.createElement("div");
  messageElement.style.padding = "5px";
  messageElement.style.borderRadius = "5px";
  messageElement.style.marginBottom = "2px";
  messageElement.style.backgroundColor =
    type === "log"
      ? "#2b2b3a" // Background for 'log'
      : type === "warn"
      ? "#f5c53280" // Background for 'warn' (dark yellow)
      : "#e74c3c80"; // Background for 'error' (dark red)
  messageElement.textContent = message;
  outputArea.appendChild(messageElement);
  outputArea.scrollTop = outputArea.scrollHeight;
}

// Handle user input for sandbox commands
function handleSandboxInput(input) {
  const iframe = document.getElementById("sandbox-iframe");

  // Create a sandboxed execution context
  if (_f6Lu8) {
    try {
      console.log("evaluating code in sandbox:", input); // Log code being evaluated
      iframe.contentWindow.eval(`
        console.log = function(message) {
          parent.logToSandboxConsole(message, "log");
        };
        console.warn = function(message) {
          parent.logToSandboxConsole(message, "warn");
        };
        console.error = function(message) {
          parent.logToSandboxConsole(message, "error");
        };
        ${input}
      `);
    } catch (err) {
      logToSandboxConsole("error: " + err.message, "error");
    }
  } else {
    logToSandboxConsole(
      "code execution is currently disabled in sandbox mode.",
      "error"
    );
  }
}

// Handle user input for commands and JavaScript
function handleInput(input, consoleType) {
  const commands = {
    help: () => {
      logToConsole("available commands:", "log");
      logToConsole("- help: Display this help message", "log");
      logToConsole("- clear: Clear the console", "log");
      logToConsole("- exit: Close the console", "log");
      logToConsole("- reboot: Reload the window", "log");
      logToConsole("- sandbox: Open a sandbox console", "log");
      logToConsole(
        "- root_auth: Enter the password to run commands on root.",
        "log"
      );
    },
    clear: () => {
      if (consoleType === "main") {
        document.getElementById("output-area").innerHTML = "";
        logToConsole("console cleared.", "log");
      }
    },
    exit: () => {
      if (consoleType === "main") {
        document.getElementById("custom-console").remove();
      }
    },
    reboot: () => {
      logToConsole("refreshing window...", "log");
      location.reload();
    },
    sandbox: () => {
      if (isSandboxOpen) {
        logToConsole("sandbox console is already open!", "error");
      } else {
        console.log("launching sandbox console..."); // Log when launching sandbox console via command
        logToConsole("launched sandbox!", "log"); // Log to the main console when sandbox is launched
        createSandboxConsole();
      }
    },
    root_auth: () => {
      if (consoleType === "main") {
        promptForPassword();
      }
    },
  };

  if (commands[input]) {
    commands[input]();
  } else {
    if (!_e5Ht2 && consoleType === "main") {
      logToConsole(
        "please enter the root password to execute commands. use 'root_auth' command to enter root password.",
        "error"
      );
    } else {
      runOnMain(input);
    }
  }
}

// Prompt for the root password
function promptForPassword() {
  const consoleElement = document.getElementById("custom-console");
  if (!consoleElement) return;

  const inputArea = document.getElementById("console-input");
  inputArea.style.display = "none";

  const passwordPrompt = document.createElement("div");
  passwordPrompt.style = `
        display: flex;
        align-items: center;
        padding: 10px;
        background: #2b2b3a;
        border-radius: 8px;
    `;
  passwordPrompt.innerHTML = `
        <div style="margin-right: 10px; color: #f8f8f2;">Enter root password:</div>
        <input type="password" id="password-input" style="
            padding: 5px;
            border: none;
            border-radius: 4px;
            background: #1e1e2f;
            color: #f8f8f2;
            flex-grow: 1;
        " />
    `;

  consoleElement.querySelector("#output-area").appendChild(passwordPrompt);

  const passwordInput = document.getElementById("password-input");
  passwordInput.focus(); // Automatically focus on the password input
  passwordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const enteredPassword = passwordInput.value.trim();
      if (enteredPassword === _d4Wv1) {
        _e5Ht2 = true;
        logToConsole(
          "correct root password: you may now execute commands.",
          "success"
        );
        passwordPrompt.remove();
        inputArea.style.display = "";
      } else {
        logToConsole(
          "error: incorrect root password, you cannot execute commands in root until the password is entered correctly.",
          "error"
        );
        passwordPrompt.remove();
        inputArea.style.display = "";
      }
    }
  });
}

// Function to handle code execution on the main page
// Function to handle code execution on the main page
function runOnMain(code) {
  try {
    // Log the code being executed
    console.log("executing:", code);

    // Restrict DOM manipulation based on content
    const restrictedPatterns = [
      /document\.body\.insertAdjacentHTML/i, // Adding new HTML
      /document\.body\.innerHTML/i, // Replacing inner HTML
      /document\.createElement/i, // Creating new elements
      /document\.createTextNode/i, // Creating text nodes
      /document\.appendChild/i, // Appending children
      /document\.removeChild/i, // Removing children
    ];

    // Check for restricted patterns
    if (restrictedPatterns.some((pattern) => pattern.test(code))) {
      throw new Error(
        "you cannot perform this type of DOM manipulation from the developer console! Please use 'sandbox mode' for such operations."
      );
    }

    // Execute code on the main website
    new Function(code)();
  } catch (err) {
    logToConsole("error: " + err.message, "error");
  }
}

// Function to make the element draggable
function makeDraggable(element, handle) {
  let offsetX = 0,
    offsetY = 0,
    initialX = 0,
    initialY = 0;

  handle.addEventListener("mousedown", (e) => {
    e.preventDefault();
    initialX = e.clientX - element.offsetLeft;
    initialY = e.clientY - element.offsetTop;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  function onMouseMove(e) {
    offsetX = e.clientX - initialX;
    offsetY = e.clientY - initialY;
    element.style.top = `${offsetY}px`;
    element.style.left = `${offsetX}px`;
  }

  function onMouseUp() {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }
}
