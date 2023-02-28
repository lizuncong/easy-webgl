## shader 接收值

```js
let x = 0;
let y = 0;
const a_position = gl.getAttribLocation(program, "a_position");
gl.vertexAttrib2f(a_position, x, y); // 1f 或者2f取决于后面接收几个参数
// gl.vertexAttrib2fv(a_position, new Float32Array([x, y]))

// 画一个点
gl.drawArrays(gl.POINTS, 0, 1);
```
