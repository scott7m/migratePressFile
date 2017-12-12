const promise1 = new Promise(function(resolve, reject) {
  // noop
});

console.log(promise1); // Promise {[[PromiseStatus]]: "pending", [[PromiseValue]]: undefined}

const promise2 = new Promise(function(resolve, reject) {
  resolve('foo');
});

console.log(promise2); // Promise {[[PromiseStatus]]: "resolved", [[PromiseValue]]: "foo"}

const promise3 = new Promise(function(resolve, reject) {
  reject(new Error('bar'));
});

console.log(promise3); // Promise {[[PromiseStatus]]: "rejected", [[PromiseValue]]: Error: bar at <anonymous>:14:10 at Promise (<anonymous>) at <anonymous>:13:28}