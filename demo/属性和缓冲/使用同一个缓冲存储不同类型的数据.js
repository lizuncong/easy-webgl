import initShaders from "./initShaders.js";

// 本Demo演示：
// 如何使用同一个缓冲存储不同类型的数据
// 如何使用DataView操作缓冲
// 如何使用vertexAttribPointer读取不同类型的数据
const main = () => {
  const canvas = document.getElementById('webgl')
  const gl = canvas.getContext('webgl')
  const vertexShaderSource1 = `
    attribute vec3 a_position;
    attribute vec4 a_color;
    varying vec4 v_color;
    void main(){
        v_color = a_color;
        gl_PointSize = 10.0;
        gl_Position = vec4(a_position, 1.0);
    }
  `
  const fragmentShaderSource1 = `
    precision mediump float;
    varying vec4 v_color;
    void main(){
        gl_FragColor = vec4(v_color);
    }
  `
  const program1 = initShaders(gl, vertexShaderSource1, fragmentShaderSource1)

  const positionLocation1 = gl.getAttribLocation(program1, 'a_position')
  const colorPosition = gl.getAttribLocation(program1, 'a_color')

  // position需要8个字节，color需要4个字节，所以一个顶点需要12个字节
  const verticesInfo = [
    {
      position: [-0.5, 0.0], // 需要8个字节
      color: [255, 0, 0, 255], // 需要4个字节
    },
    {
      position: [0.5, 0.0],
      color: [0, 255, 0, 255],
    },
    {
      position: [0.0, 0.8],
      color: [0, 0, 255, 255]
    }
  ]

  // position需要8个字节，color需要4个字节，所以一个顶点需要12个字节
  const totalSizePerVertex = 12;
  const buffer = new ArrayBuffer(totalSizePerVertex * verticesInfo.length)
  const dv = new DataView(buffer);
  for (let i = 0; i < verticesInfo.length; i++) {
    const vertex = verticesInfo[i]
    dv.setFloat32(totalSizePerVertex * i, vertex.position[0], true)
    dv.setFloat32(totalSizePerVertex * i + 4, vertex.position[1], true)
    dv.setUint8(totalSizePerVertex * i + 8, vertex.color[0], true)
    dv.setUint8(totalSizePerVertex * i + 9, vertex.color[1], true)
    dv.setUint8(totalSizePerVertex * i + 10, vertex.color[2], true)
    dv.setUint8(totalSizePerVertex * i + 11, vertex.color[3], true)

  }
  console.log('buffer...', buffer)
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW)

  // 设置属性positionLocation1的一系列状态，告诉它应该怎么从缓冲中读取数据
  // 定义点的信息
  gl.vertexAttribPointer(
    positionLocation1,
    2, 
    gl.FLOAT, 
    false,
    totalSizePerVertex, 
    0
  );
  gl.vertexAttribPointer(
    colorPosition,
    4, 
    gl.UNSIGNED_BYTE,
    true,
    totalSizePerVertex,
    2 * Float32Array.BYTES_PER_ELEMENT
  );


  gl.enableVertexAttribArray(positionLocation1);
  gl.enableVertexAttribArray(colorPosition);

  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program1)
  // 告诉webgl绘制3个点
  gl.drawArrays(gl.POINTS, 0, 3)

}

main();
