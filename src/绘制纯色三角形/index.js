import initShaders from "./initShaders.js";

const canvas = document.getElementById("webgl");
const gl = canvas.getContext("webgl");

let vertexSource = `
    attribute vec2 a_position;
    void main(){
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`;

let fragmentSource = `
    precision mediump float;
    void main(){
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

const program = initShaders(gl, vertexSource, fragmentSource);

// 清空canvas画布
gl.clearColor(0.5, 0.5, 0.5, 1.0); // rgba()
gl.clear(gl.COLOR_BUFFER_BIT);


let vertices = [
    -0.5, 0.0,
    0.5, 0.0,
    0.0, 0.8
]
vertices = new Float32Array(vertices)

/**
 * buffer：分5个步骤
 * **/

//1 
const buffer = gl.createBuffer()
//2 绑定buffer
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
// 3
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
// 4把带有数据的buffer赋值给attribute
const a_position = gl.getAttribLocation(program, 'a_position')
gl.vertexAttribPointer(
    a_position,
    2,
    gl.FLOAT,
    false,
    0,
    0
)
// 5 确认赋值
gl.enableVertexAttribArray(a_position)

gl.drawArrays(gl.TRIANGLES, 0, 3)