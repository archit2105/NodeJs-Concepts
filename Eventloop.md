# Event Loop in Node.js

The **Node.js Event Loop** allows JavaScript to perform non-blocking asynchronous operations even though JavaScript runs on a single thread.

Node.js uses **libuv** to implement the event loop.

---

## Why Event Loop is Needed

- JavaScript is single-threaded
- I/O operations (file, network, timers) are slow
- Event loop allows async tasks without blocking execution

---

## Core Components

- **Call Stack**
- **Node APIs (libuv)**
- **Event Loop**
- **Callback Queues**

---

## Event Loop Phases (IMPORTANT)

Node.js event loop runs in **phases**:

1. **Timers**
2. **Pending Callbacks**
3. **Idle, Prepare**
4. **Poll**
5. **Check**
6. **Close Callbacks**

---

## 1. Timers Phase

Executes callbacks scheduled by:
- `setTimeout`
- `setInterval`

```javascript
setTimeout(() => {
  console.log("Timer executed");
}, 0);
```

---

## 2. Pending Callbacks Phase

Executes system-level callbacks:
- TCP errors
- Socket operations

---

## 3. Poll Phase (MOST IMPORTANT)

- Executes I/O callbacks
- Waits for new I/O events
- Moves to `check` phase if `setImmediate` exists

```javascript
const fs = require("fs");

fs.readFile(__filename, () => {
  console.log("File read");
});
```

---

## 4. Check Phase

Executes callbacks scheduled by `setImmediate`

```javascript
setImmediate(() => {
  console.log("setImmediate executed");
});
```

---

## 5. Close Callbacks Phase

Handles cleanup:
- `socket.on("close")`
- resource deallocation

---

## Microtask Queue (Runs Between Phases)

Microtasks execute **after each phase** and have highest priority.

Includes:
- `Promise.then`
- `process.nextTick`

```javascript
Promise.resolve().then(() => console.log("Promise"));
process.nextTick(() => console.log("nextTick"));
```

Execution order:

process.nextTick → Promise

---

## process.nextTick vs Promise

- `process.nextTick` runs **before** Promises
- Can starve the event loop if misused

---

## Complete Execution Order Example

```javascript
console.log("Start");

setTimeout(() => console.log("setTimeout"), 0);
setImmediate(() => console.log("setImmediate"));

Promise.resolve().then(() => console.log("Promise"));
process.nextTick(() => console.log("nextTick"));

console.log("End");
```

Output:

Start  
End  
nextTick  
Promise  
setTimeout / setImmediate (order depends on context)

---

## Key Differences: Browser vs Node.js

| Browser | Node.js |
|-------|--------|
| Web APIs | libuv |
| Single task queue | Multiple phases |
| No `nextTick` | Has `process.nextTick` |

---

## Event Loop Diagram

![JavaScript Event Loop Diagram](https://media.licdn.com/dms/image/v2/D5612AQHXppQIej90rA/article-cover_image-shrink_720_1280/B56ZZZi0nvGUAQ-/0/1745259023668?e=2147483647&v=beta&t=Ik0NV91-OCZIMtfl8K565u1t7wVSnIINvQsiWsTP4Cc)

---

## Summary

- Node.js event loop is phase-based
- Microtasks run after every phase
- `process.nextTick` has highest priority
- Enables scalable, non-blocking I/O
