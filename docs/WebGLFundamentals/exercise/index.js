import initShaders from "./initShaders.js";


const main = () => {
  const canvas = document.getElementById('webgl')
  const gl = canvas.getContext('webgl2')
  const vertexShaderSource1 = `
    attribute vec2 a_position;
    attribute vec3 a_color;
    varying vec3 v_color;
    uniform vec2 u_resolution;
    void main(){
        // 从像素坐标转换到0.0到1.0
        vec2 zeroToOne = a_position / u_resolution;
        // 再把0->1转换0->2
        vec2 zeroToTwo = zeroToOne * 2.0;
        // 把0->2转换到-1->+1。
        vec2 clipSpace = zeroToTwo - 1.0;
        gl_PointSize = 10.0;
        v_color = a_color;
        gl_Position = vec4(clipSpace, 0.0, 1.0);
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
  const colorLocation1 = gl.getAttribLocation(program1, 'a_color')
  const resolutionUniformLocation = gl.getUniformLocation(program1, "u_resolution");


  let verticesInfo = [
    // 每行前两个表示坐标，后面三个表示颜色
    1.0, 0.0, 1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 1.0, 0.0, 0.0,
    0.0, -1.0, 0.0, 1.0, 0.0
  ]
  verticesInfo = new Float32Array(verticesInfo)

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, verticesInfo, gl.STATIC_DRAW)


  gl.vertexAttribPointer(
    positionLocation1,
    2,
    gl.FLOAT,
    false,
    20,
    0
  );

  gl.vertexAttribPointer(
    colorLocation1,
    3,
    gl.FLOAT,
    false,
    20,
    8
  );



  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program1)

  gl.enableVertexAttribArray(positionLocation1);
  gl.enableVertexAttribArray(colorLocation1);

  gl.drawArrays(gl.POINTS, 0, 5)

}

main();
