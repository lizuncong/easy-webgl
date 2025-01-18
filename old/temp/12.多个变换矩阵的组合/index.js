import initShaders from "./initShaders.js";
const { mat4,  } = glMatrix
console.log(glMatrix)
const canvas = document.getElementById("webgl");
const gl = canvas.getContext("webgl");

let vertexSource = `
    attribute vec3 a_position;
    uniform mat4 u_sMatrix;
    uniform mat4 u_tMatrix;
    uniform mat4 u_rMatrix;

    void main(){
      gl_Position = u_rMatrix * u_tMatrix  * vec4(a_position, 1.0); // 从右往左，先平移再旋转
      gl_PointSize = 10.0;
    }
`;

let fragmentSource = `
    precision mediump float;
    void main(){
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

const program = initShaders(gl, vertexSource, fragmentSource);

function initVertexBuffers() {
  const vertices = new Float32Array([
    -0.2, -0.2, 0.0,
    0.2, -0.2, 0.0, 
    0.0, 0.2, 0.0,
  ]);
  const FSIZE = vertices.BYTES_PER_ELEMENT;
  const buffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const a_position = gl.getAttribLocation(program, "a_position");
  gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 3 * FSIZE, 0);
  gl.enableVertexAttribArray(a_position);
}

initVertexBuffers()

function draw(){
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

const tMatrix = mat4.create();
const sMatrix = mat4.create();
const rMatrix = mat4.create();
mat4.fromTranslation(tMatrix, [0.5,0.0, 0.0])
mat4.fromScaling(sMatrix, [2, 1, 1])
mat4.fromRotation(rMatrix, glMatrix.glMatrix.toRadian(30), [0,0, 1])

const u_rMatrix = gl.getUniformLocation(program, 'u_rMatrix')
gl.uniformMatrix4fv(u_rMatrix, false, rMatrix)
const u_sMatrix = gl.getUniformLocation(program, 'u_sMatrix')
gl.uniformMatrix4fv(u_sMatrix, false, sMatrix)
const u_tMatrix = gl.getUniformLocation(program, 'u_tMatrix')
gl.uniformMatrix4fv(u_tMatrix, false, tMatrix)
draw()


