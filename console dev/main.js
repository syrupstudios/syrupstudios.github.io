//prevent right click 
document.oncontextmenu = () => {
  return false
}

document.onkeydown = e => {
  //Prevent F12 key
  if(e.key == "F12") {
    return false
  }
  //Prevent page source / ctrl + u
  if (e.ctrlKey && e.key == "u") {
    return false
  }
}

let consoleLocked = true;
const correctPassword = "yourPassword";

document.addEventListener("keydown", function(e) {
    // Disable Ctrl + Shift + I if console is locked
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") {
        if (consoleLocked) {
            e.preventDefault();
        }
    }

    // Step 1: Unlock prompt with Ctrl + Shift + D
    if (e.ctrlKey && e.shiftKey && e.altKey && e.key.toLowerCase() === "d") {
        // Inform the user that step 1 is complete
        alert("Step 1 complete! Please enter the password to unlock the console.");
        
        // Prompt for password
        const password = prompt("Enter the password:");
        
        // Check if the password is correct
        if (password === correctPassword) {
            consoleLocked = false; // Unlock the console
            alert("Console unlocked! You can now use Ctrl + Shift + I.");
        } else {
            alert("Incorrect password. The console remains locked.");
        }
        
        e.preventDefault(); // Prevent any default action
    }
});
