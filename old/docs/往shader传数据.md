## shader 传值的三种方式

- attribute 传值。用 attribute 将 JavaScript 中的数据传入 vertex shader 中，只能用于 vertex shader
- uniform。可以用 uniform 将 JavaScript 中的数据传入 vertex shader 或者 fragment shader。vertex shader 和 fragment shader 都可以用这种方式。
- varying。将 vertex shader 中的数据传递给 fragment shader

### attribute 传值

将数据从 JavaScript 传递到 vertex shader 中

```js
// vertex shader中通过attribute定义变量
let vertexSource = `
    attribute vec2 a_position;
    attribute float a_size;
    void main(){
        gl_Position = vec4(a_position, 0.0, 1.0);
        gl_PointSize = a_size;
    }
`;

// 在js中给shader传值
let x = 0;
let y = 0;
const a_position = gl.getAttribLocation(program, "a_position");
gl.vertexAttrib2f(a_position, x, y); // 2f或者1f取决于后面接收的参数的数量

const a_size = gl.getAttribLocation(program, "a_size");
gl.vertexAttrib1f(a_size, 10.0);

// 画一个点
gl.drawArrays(gl.POINTS, 0, 1);
```

### uniform 传值

uniform 既可以用于 vertex shader，也可以用于 fragment shader

```js
let vertexSource = `
    attribute vec2 a_position;
    uniform float u_size;
    void main(){
        gl_Position = vec4(a_position, 0.0, 1.0);
        gl_PointSize = u_size;
    }
`;

let fragmentSource = `
    precision mediump float;
    uniform vec3 u_color;
    void main(){
        gl_FragColor = vec4(u_color, 1.0);
    }
`;

const a_position = gl.getAttribLocation(program, "a_position");
gl.vertexAttrib2f(a_position, -0.6, 0.0);

const u_color = gl.getUniformLocation(program, "u_color");
gl.uniform3f(u_color, 1.0, 1.0, 0.0);

const u_size = gl.getUniformLocation(program, "u_size");
gl.uniform1f(u_size, 40.0);

// 画一个点
gl.drawArrays(gl.POINTS, 0, 1);
```

### varying 传值

将 vertex shader 中的数据传递给 fragment shader。这种方式不需要从 javascript 传值过来。

用法也很简单，在 vertex shader 和 fragment shader 中使用 varying 声明名字相同的变量，比如下面的 `v_position`即可

```js
let vertexSource = `
    attribute vec2 a_position;
    uniform float u_size;
    varying vec2 v_position;
    void main(){
        v_position = a_position;
        gl_Position = vec4(a_position, 0.0, 1.0);
        gl_PointSize = u_size;
    }
`;

let fragmentSource = `
    precision mediump float;
    uniform vec3 u_color;
    varying vec2 v_position;
    void main(){
        gl_FragColor = vec4(v_position, 0.0, 1.0);
    }
`;
```
