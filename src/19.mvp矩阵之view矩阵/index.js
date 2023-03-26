import initShaders from "./initShaders.js";
import { positions, colors } from "./cube_data.js";
const { mat4 } = glMatrix;

const canvas = document.getElementById("webgl");
const gl = canvas.getContext("webgl");

let vertexSource = `
attribute vec3 a_position;
attribute vec3 a_color;
varying vec3 v_color;
uniform mat4 u_viewMatrix;
uniform mat4 u_scaleMatrix;
void main() {
   v_color = a_color;
   mat4 modelMatrix = u_scaleMatrix;
   gl_Position = u_viewMatrix * modelMatrix * vec4(a_position, 1.0);
}
`;

let fragmentSource = `
precision mediump float;
varying vec3 v_color;
void main() {
    gl_FragColor = vec4(v_color, 1.0);
}
`;

const program = initShaders(gl, vertexSource, fragmentSource);
initVertexBuffers();

let scaleMatrix = mat4.create()
mat4.fromScaling(scaleMatrix, [0.5, 0.5, 0.5])
let u_scaleMatrix = gl.getUniformLocation(program, 'u_scaleMatrix')
gl.uniformMatrix4fv(u_scaleMatrix, false, scaleMatrix)

let viewMatrix = mat4.create()
let eye = [0, 0, 1]
let center = [0, 0, 0]
let up = [0, 1, 0]
mat4.lookAt(viewMatrix, eye, center, up)

let u_viewMatrix = gl.getUniformLocation(program, 'u_viewMatrix')
gl.uniformMatrix4fv(u_viewMatrix, false, viewMatrix)

function initVertexBuffers() {
   let vertices = new Float32Array([
        // x, y, z, r, g, b
        -0.5, -0.5, 0.0, 1.0, 0.0, 0.0,
        0.5, -0.5, 0.0, 0.0, 1.0, 0.0,
        0.0, 0.5, 0.0, 0.0, 0.0, 1.0,
    ])
    let FSIZE = vertices.BYTES_PER_ELEMENT // Float32 Size = 4

    let buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    let a_position = gl.getAttribLocation(program, 'a_position')
    gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 0)
    gl.enableVertexAttribArray(a_position)

    let a_color = gl.getAttribLocation(program, 'a_color')
    gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3)
    gl.enableVertexAttribArray(a_color)
}

draw();
window.onkeydown = function (e) {
    let step = 0.01
    if (e.keyCode === 37) { //左
        eye[0] -= step
    } else if (e.keyCode === 39) { // 右
        eye[0] += step
    } else if (e.keyCode === 38) { // 上
        eye[1] += step
    } else if (e.keyCode === 40) { // 下
        eye[1] -= step
    }
    mat4.lookAt(viewMatrix, eye, center, up)
    gl.uniformMatrix4fv(u_viewMatrix, false, viewMatrix)
    draw(gl)
}
function draw() {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.enable(gl.DEPTH_TEST);
  gl.drawArrays(gl.TRIANGLES, 0, 3)

}
