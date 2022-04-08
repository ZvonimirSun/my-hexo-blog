---
title: Promise多个then、catch、finally的测试与总结
date: 2022-04-07 23:42:28
categories:
  - Wiki
  - JavaScript
  - Browser
tags:
  - JavaScript
  - Promise
---

没有经过测试，其实我不太清楚如果一个 Promise 后加了多个 then、catch、finally 时候的处理逻辑。测试一下，可以帮助我们很好的去除误解，了解程序真正的执行逻辑。

<!--more-->

## 测试代码

### 一、测试一

一个基础的 Promise

```js
function testPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("成功！");
    }, 1000);
    setTimeout(() => {
      reject("失败！");
    }, 3000);
  })
    .then((res) => {
      console.log("then:", res);
      return "then return";
    })
    .catch((err) => {
      console.log("catch:", err);
      return "catch return";
    })
    .finally((res) => {
      console.log("finally", res);
      return "finally return";
    });
}
testPromise();
```

![](https://img.iszy.xyz/1649347940017.png)

1. 一个 promise 中，resolve 和 reject 只会执行最先触发的一个

### 二、测试二

多次添加`then`、`catch`、`finally`方法。

```js
function testPromise() {
  return new Promise((resolve, reject) => {
    resolve("成功！");
  })
    .then((res) => {
      console.log("then 1:", res);
      return "then 1 return";
    })
    .catch((err) => {
      console.log("catch 1:", err);
      return "catch 1 return";
    })
    .finally((res) => {
      console.log("finally 1", res);
      return "finally 1 return";
    })
    .then((res) => {
      console.log("then 2:", res);
      return "then 2 return";
    })
    .catch((err) => {
      console.log("catch 2:", err);
      return "catch 2 return";
    })
    .finally((res) => {
      console.log("finally 2", res);
      return "finally 2 return";
    })
    .then((res) => {
      console.log("then 3:", res);
      return "then 3 return";
    })
    .catch((err) => {
      console.log("catch 3:", err);
      return "catch 3 return";
    })
    .finally((res) => {
      console.log("finally 3", res);
      return "finally 3 return";
    });
}
testPromise();
```

运行结果

![](https://img.iszy.xyz/1649347319739.png)

1. 第一个 then 的参数是 resolve 的参数值，然后执行第一个 finally
2. 第二个 then 的回调参数是第一个 then 的返回值，然后执行第二个 finally，以此类推
3. finally 无参数

### 三、测试三

抛出错误

```js
function testPromise() {
  return new Promise((resolve, reject) => {
    reject("失败！");
  })
    .then((res) => {
      console.log("then 1:", res);
      return "then 1 return";
    })
    .catch((err) => {
      console.log("catch 1:", err);
      return "catch 1 return";
    })
    .finally((res) => {
      console.log("finally 1", res);
      return "finally 1 return";
    })
    .then((res) => {
      console.log("then 2:", res);
      return "then 2 return";
    })
    .catch((err) => {
      console.log("catch 2:", err);
      return "catch 2 return";
    })
    .finally((res) => {
      console.log("finally 2", res);
      return "finally 2 return";
    })
    .then((res) => {
      console.log("then 3:", res);
      return "then 3 return";
    })
    .catch((err) => {
      console.log("catch 3:", err);
      return "catch 3 return";
    })
    .finally((res) => {
      console.log("finally 3", res);
      return "finally 3 return";
    });
}
testPromise();
```

![](https://img.iszy.xyz/1649348250796.png)

1. reject 抛出的错误会在第一个 catch 中捕获，参数是 reject 的参数值，接着执行第一个 finally
2. 继续会执行第二个 then，参数是第一个 catch 的返回值，然后执行第二个 finally，接下来与上个测试类似，以此类推

### 四、测试四

1. 在 resolve 后抛出错误
2. 在第一个 then 中抛出错误
3. 在第一个 catch 中抛出错误
4. 在第二个 finally 中抛出错误

```js
function testPromise() {
  return new Promise((resolve, reject) => {
    resolve("成功！");
  })
    .then((res) => {
      console.log("then 1:", res);
      throw new Error("then 1 throw");
    })
    .catch((err) => {
      console.log("catch 1:", err);
      throw new Error("catch 1 throw");
    })
    .finally((res) => {
      console.log("finally 1", res);
      return "finally 1 return";
    })
    .then((res) => {
      console.log("then 2:", res);
      return "then 2 return";
    })
    .catch((err) => {
      console.log("catch 2:", err);
      return "catch 2 return";
    })
    .finally((res) => {
      console.log("finally 2", res);
      throw new Error("finally 2 throw");
    })
    .then((res) => {
      console.log("then 3:", res);
      return "then 3 return";
    })
    .catch((err) => {
      console.log("catch 3:", err);
      return "catch 3 return";
    })
    .finally((res) => {
      console.log("finally 3", res);
      return "finally 3 return";
    });
}
testPromise();
```

![](https://img.iszy.xyz/1649350087385.png)

1. 在 resolve 后，抛出错误不会被处理，与 reject 处理相似
2. 在第一个 then 中抛出错误，被后续的第一个 catch（catch1）捕获，参数是错误值，后续继续执行。
3. 在第一个 catch 中抛出错误，被后续的第一个 catch（catch2）捕获，参数是错误值，后续继续执行。
4. 在第二个 finally 中抛出错误，被后续的第一个 catch（catch3）捕获，参数是错误值，后续继续执行。

### 五、测试五

```js
function testPromise() {
  const a = new Promise((resolve, reject) => {
    resolve("成功！");
  });
  const b = a.finally((res) => {
    console.log("finally 1", res);
    return "finally 1 return";
  });
  const c = a.then((res) => {
    console.log("then 1:", res);
    throw new Error("then 1 throw");
  });
  const d = a.catch((err) => {
    console.log("catch 1:", err);
    throw new Error("catch 1 throw");
  });
  const e = a.catch((err) => {
    console.log("catch 2:", err);
  });
  console.log("a === b", a === b);
  console.log("a === c", a === c);
  console.log("a === d", a === d);
}
testPromise();
```

![](https://img.iszy.xyz/1649350721994.png)

1. then、finally、catch 返回的都是一个新的 Promise，所以 a、b、c、d、e 的值都是不同的
2. 在 a 上添加的 catch 仅会处理 a 的 reject 和错误，不会处理 then 和 finally 的错误
3. then、finally 执行是按照事件添加顺序

### 六、测试六

分别在 a 和 a.then 上添加 then、catch、finally

```js
function testPromise() {
  const a = new Promise((resolve, reject) => {
    resolve("成功！");
  });
  const b = a.then((res) => {
    console.log("then 1:", res);
    return "then 1 return";
  });
  a.catch((err) => {
    console.log("catch 1:", err);
    return "catch 1 return";
  });
  a.finally((res) => {
    console.log("finally 1", res);
    return "finally 1 return";
  });
  b.then((res) => {
    console.log("then 2:", res);
    return "then 2 return";
  });
  b.catch((err) => {
    console.log("catch 2:", err);
    return "catch 2 return";
  });
  b.finally((res) => {
    console.log("finally 2", res);
    return "finally 2 return";
  });
  a.then((res) => {
    console.log("then 3:", res);
    return "then 3 return";
  });
  a.catch((err) => {
    console.log("catch 3:", err);
    return "catch 3 return";
  });
  a.finally((res) => {
    console.log("finally 3", res);
    return "finally 3 return";
  });
}
testPromise();
```

![](https://img.iszy.xyz/1649351186185.png)

1. 将 a.then 的返回值保存为 b，可以看到 b 上添加的 then、catch、finally 执行必然在 a 上添加的 then、catch、finally 之后执行
2. 在同一个 Promise 对象上多次添加 then、catch、finally，也会按照添加顺序依次执行

## 总结

为了方便，以下内容中“三个方法”指 then、catch、finally 方法

1. 一个 Promise 中，resolve 和 reject _只会执行最先触发的一个_
2. Promise 对象的三个方法都会返回一个 _新的 Promise 对象_
3. 因为三个方法都会返回 Promise 对象，且返回值和错误都会*向后传递*，所以可以*链式调用*。比如 Promise 链靠前的方法中抛出错误，会被后续 Promise 对象的 catch 方法捕获。
4. 在三个方法中 _return_ 值，会作为*后续的第一个 then 方法*的参数
5. 在三个方法中 _throw_ 值，会被*后续的第一个 catch 方法*捕获。如果在这个 catch 方法中没有继续抛出错误，则不会被后续的 catch 方法捕获
6. 在同一个 Promise 对象上，_多次添加_ then、finally 方法，_均会被执行_，且会 _按照添加顺序依次执行_
7. 在同一个 Promise 对象上，_多次添加_ catch 方法，仅会被*第一个*添加的 catch 方法捕获
8. 在 Promise 对象的三个方法 _返回的 Promise 对象_ 上添加的三个方法，必然会 _在原 Promise 对象_ 上添加的三个方法 _之后执行_
9. 在一个 Promise 链上，多次添加 then、catch、finally 也会按照添加顺序依次执行。
