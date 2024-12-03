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
    1, // size，attribute变量的长度(vec2)
    gl.FLOAT, // type, buffer的数据类型
    false,
    4, // 每个点的信息所占的bytes
    0
  );
 


  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program1)
  // 先修改属性的默认值
  gl.vertexAttrib4f(positionLocation1, 0.5, 0.5, 0.5, 1.0);
  gl.drawArrays(gl.POINTS, 0, 1)

  // 然后再使用缓冲，注意，这里缓冲只提供了一个数据，剩下三个数据需要默认从vec4(0,0,0,1.0)中读取后面三个
  // 而不是从属性的默认值读取
  gl.enableVertexAttribArray(positionLocation1);

  // 告诉webgl绘制3个点
  gl.drawArrays(gl.POINTS, 0, 3)

}

main();








