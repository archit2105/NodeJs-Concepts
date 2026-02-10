# 🧵 Worker Threads in Node.js: A Complete Guide

## 1. What are Worker Threads?
The `worker_threads` module allows Node.js to execute JavaScript in **parallel** on multiple threads. 

### The "Truth" about Node.js
* **Standard Node.js:** Single-threaded Event Loop + Multi-threaded Libuv (C++) for I/O.
* **With Worker Threads:** You can create additional "Main" threads to handle CPU-intensive tasks without blocking the Event Loop.

---

## 2. Why do we need them?
In a standard Node app, a heavy calculation (like image processing or complex math) freezes the entire process. No other users can connect until that task is done. Worker threads solve this by offloading the heavy lifting.


---

## 3. How it Works (The Architecture)
Each Worker thread has its own **V8 Instance** and **Event Loop**, but they exist within the same process. They communicate via **Message Passing**.



---

## 4. Implementation Example

### `worker.js` (The Background Script)
This is where the heavy logic lives.
```javascript
const { parentPort, workerData } = require('worker_threads');

// 1. Receive data from the main thread via workerData
console.log(`Worker starting task: ${workerData.taskName}`);

// 2. Perform heavy calculation
let result = 0;
for (let i = 0; i < 1_000_000_000; i++) {
  result += i;
}

// 3. Send the result back
parentPort.postMessage({ status: 'Done', total: result });