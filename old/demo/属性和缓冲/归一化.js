import initShaders from "./initShaders.js";

// 本Demo演示归一化：
// 使用UNSIGNED_BYTE类型的数据存储颜色值，并在调用vertexAttribPointer告诉
// webgl需要归一化
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

  let positions = [
    -0.5, 0.0,
    0.5, 0.0,
    0.0, 0.5,
  ]
  let colors = [ // 这些数据在存入缓冲时将被截取成Uint8Array类型
    255, 0.1, 0.1111,// 会被截取成255,0,0
    0.222, 255, 0,// 会被截取成0,255,0
    0, 0, 255.888, // 会被截取成0, 0, 255
  ]
  colors = new Uint8Array(colors)
  positions = new Float32Array(positions)



  const FSIZE = positions.BYTES_PER_ELEMENT // 4
  const ISIZE = colors.BYTES_PER_ELEMENT // 1

  console.log('positions...', FSIZE, positions)

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW)

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.vertexAttribPointer(
    positionLocation1,
    2,
    gl.FLOAT,
    false,
    2 * FSIZE,
    0
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.vertexAttribPointer(
    colorPosition,
    3,
    gl.UNSIGNED_BYTE,
    true,// 需要归一化
    3 * ISIZE,
    0
  );

  gl.enableVertexAttribArray(positionLocation1);
  gl.enableVertexAttribArray(colorPosition);

  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program1)
  gl.drawArrays(gl.POINTS, 0, 3)

}

main();

