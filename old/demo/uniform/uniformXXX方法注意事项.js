import initShaders from "./initShaders.js";

// 声明uniform变量的长度和uniformxxx的长度必须一致。比如如果声明uniform vec4 u_offset;
// 则调用gl.uniform4f给u_offset赋值，而不能是gl.uniform3f。
const main = () => {
  const canvas = document.getElementById('webgl')
  const gl = canvas.getContext('webgl2')
  const vertexShaderSource1 = `
    uniform vec4 u_offset;
    void main(){
        gl_PointSize = 10.0;
        gl_Position = vec4(0.0, 0.0, 0.0, 1.0) + u_offset;
    }
  `
  const fragmentShaderSource1 = `
    precision mediump float;
    void main(){
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `
  const program1 = initShaders(gl, vertexShaderSource1, fragmentShaderSource1)
  const offsetLoc = gl.getUniformLocation(program1, 'u_offset')
  console.log('offsetLoc...', offsetLoc)

  
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program1)

  // offset预期的是4个分量，因此这里不符合预期，会报错
  gl.uniform3f(offsetLoc, 0.5, 0.5, 0.0)

  
  gl.drawArrays(gl.POINTS, 0, 1)

}

main();

