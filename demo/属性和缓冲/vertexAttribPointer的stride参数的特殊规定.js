import initShaders from "./initShaders.js";


// 本Demo演示：
// gl.vertexAttribPointer传递的stride参数必定是传递给type对应类型字节数的倍数
// 比如如果传递给vertexAttribPointer的type是gl.FLOAT，一个gl.FLOAT类型的数据占用4个字节，
// 那么传递给stride的值一定是4的倍数，否则会报错
const main = () => {
  const canvas = document.getElementById('webgl')
  const gl = canvas.getContext('webgl')
  const vertexShaderSource1 = `
    attribute vec3 a_position;
    attribute vec3 a_color;
    varying vec3 v_color;
    void main(){
        v_color = a_color;
        gl_PointSize = 10.0;
        gl_Position = vec4(a_position, 1.0);
    }
  `
  const fragmentShaderSource1 = `
    precision mediump float;
    varying vec3 v_color;
    void main(){
        gl_FragColor = vec4(v_color, 1.0);
    }
  `
  const program1 = initShaders(gl, vertexShaderSource1, fragmentShaderSource1)

  const positionLocation1 = gl.getAttribLocation(program1, 'a_position')
  const colorPosition = gl.getAttribLocation(program1, 'a_color')

  // position需要8个字节，color需要3个字节，所以一个顶点需要11个字节
  const verticesInfo = [
    {
      position: [-0.5, 0.0], // 需要8个字节
      color: [255, 0, 0], // 需要3个字节
    },
    {
      position: [0.5, 0.0],
      color: [0, 255, 0],
    },
    {
      position: [0.0, 0.8],
      color: [0, 0, 255]
    }
  ]

  // position需要8个字节，color需要3个字节，所以一个顶点需要11个字节
  const totalSizePerVertex = 11;
  const buffer = new ArrayBuffer(totalSizePerVertex * verticesInfo.length)
  const dv = new DataView(buffer);
  for (let i = 0; i < verticesInfo.length; i++) {
    const vertex = verticesInfo[i]
    dv.setFloat32(totalSizePerVertex * i, vertex.position[0], true)
    dv.setFloat32(totalSizePerVertex * i + 4, vertex.position[1], true)
    dv.setUint8(totalSizePerVertex * i + 8, vertex.color[0], true)
    dv.setUint8(totalSizePerVertex * i + 9, vertex.color[1], true)
    dv.setUint8(totalSizePerVertex * i + 10, vertex.color[2], true)

  }
  console.log('buffer...', buffer)
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW)


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
    3, 
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
