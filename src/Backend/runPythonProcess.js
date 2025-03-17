import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { spawn } = require("child_process");

const inputData = { text: "Hello how are you" };
// const inputData = { text: "i love you" };


// Spawn a Python process
const pythonProcess = spawn("python", ["run_model.py"]);


// Send input data to Python via stdin
pythonProcess.stdin.write(JSON.stringify(inputData));
pythonProcess.stdin.end(); // Close stdin after sending data

// Capture Python output
pythonProcess.stdout.on("data", (data) => {
    console.log(`Python Output: ${data.toString()}`);
});

// Capture any errors
pythonProcess.stderr.on("data", (data) => {
    console.error(`Python Error: ${data.toString()}`);
});