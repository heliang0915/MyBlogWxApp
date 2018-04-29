// 在 Worker 线程执行上下文会全局暴露一个 `worker` 对象，直接调用 worker.onMeesage/postMessage 即可

// console.log(worker);

// worker.onMessage(function (res) {
//     console.log("res>>>>"+res)
//     console.log(wx);
// })


// worker.terminate()