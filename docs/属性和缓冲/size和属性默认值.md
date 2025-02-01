## 前言
本篇文章主要演示vertexAttribPointer传递的size小于顶点着色器中定义的attribute属性的组成数量时，顶点着色器如何取值。比如顶点着色器中声明attribute vec4 a_position;具有4个分量，但是vertexAttribPointer
的size却为1，此时a_position属性应该如何读取值

```js
import initShaders from "./initShaders.js";

const main = () => {
  const canvas = document.getElementById('webgl')
  const gl = canvas.getContext('webgl2')
  const vertexShaderSource1 = `
    attribute vec4 a_position;
    void main(){
        gl_PointSize = 10.0;
        gl_Position = vec4(a_position);
    }
  `
  const fragmentShaderSource1 = `
    precision mediump float;
    void main(){
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `
  const program1 = initShaders(gl, vertexShaderSource1, fragmentShaderSource1)

  const positionLocation1 = gl.getAttribLocation(program1, 'a_position')

  let positions = [
    -0.5,
    0.5,
    0.0, 
  ]
  positions = new Float32Array(positions)



  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

  // 设置属性positionLocation1的一系列状态，告诉它应该怎么从缓冲中读取数据
  // 定义点的信息
  gl.vertexAttribPointer(
    positionLocation1,
    1, 
    gl.FLOAT,
    false,
    4, 
    0
  );
 


  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program1)
  // 先修改属性的默认值。但需要注意的是，
  // 即使修改了默认值，在 WebGL 读取缓冲时，
  // 默认值还是会按照 vec4(0.0, 0.0, 0.0, 1.0) 读取。
  gl.vertexAttrib4f(positionLocation1, 0.5, 0.5, 0.5, 1.0);
  gl.drawArrays(gl.POINTS, 0, 1)

  // 然后再使用缓冲，注意，这里缓冲只提供了一个数据，剩下三个数据需要默认从vec4(0,0,0,1.0)中读取后面三个
  // 而不是从属性修改后的默认值读取，比如上面修改后的属性默认值为vec4(0.5,0.5,0.5,1.0)
  gl.enableVertexAttribArray(positionLocation1);

  // 告诉webgl绘制3个点
  gl.drawArrays(gl.POINTS, 0, 3)

}

main();
```