const canvas = document.getElementById('webgl')
const gl = canvas.getContext('webgl')

const vertexShaderSource = `
    attribute vec4 a_Position;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = 10.0;
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    void main(){
        gl_FragColor = vec4(1,0,0,1.0);
    }
`;

const program = initShaders(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);
const a_Position = gl.getAttribLocation(program, "a_Position");


gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.vertexAttrib3f(a_Position, 0.5, 0.0, 0.0);
gl.drawArrays(gl.POINTS, 0, 1);

gl.vertexAttrib3f(a_Position, 0.3, 0.0, 0.0);
gl.drawArrays(gl.POINTS, 0, 1);

Promise.resolve().then((res) => {
  gl.vertexAttrib3f(a_Position, 0.1, 0.0, 0.0);
  gl.drawArrays(gl.POINTS, 0, 1);
});