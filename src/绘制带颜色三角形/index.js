import initShaders from "./initShaders.js";

const canvas = document.getElementById("webgl");
const gl = canvas.getContext("webgl");

let vertexSource = `
    attribute vec2 a_position;
    attribute vec3 a_color;
    varying vec3 v_color;
    void main(){
        v_color = a_color;
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`;

let fragmentSource = `
    precision mediump float;
    varying vec3 v_color;
    void main(){
        gl_FragColor = vec4(v_color, 1.0);
    }
`;

const program = initShaders(gl, vertexSource, fragmentSource);

// 清空canvas画布
gl.clearColor(0.5, 0.5, 0.5, 1.0); // rgba()
gl.clear(gl.COLOR_BUFFER_BIT);

let vertices = [
    // x y  r g b 前面两个代表坐标，后面三个代表颜色rgb的值
    -0.5, 0.0, 1.0, 0.0, 0.0,
    0.5, 0.0, 0.0, 1.0, 0.0,
    0.0, 0.8, 0.0, 0.0, 1.0
];
vertices = new Float32Array(vertices);

const FSIZE = vertices.BYTES_PER_ELEMENT // 4
/**
 * buffer：分5个步骤
 * **/
//1
const buffer = gl.createBuffer();
//2 绑定buffer
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
// 3
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
// 4把带有数据的buffer赋值给attribute
const a_position = gl.getAttribLocation(program, "a_position");
const a_color = gl.getAttribLocation(program, 'a_color')
// 定义点的信息
gl.vertexAttribPointer(
  a_position,
  2, // size，attribute变量的长度(vec2)
  gl.FLOAT, // type, buffer的数据类型
  false,
  5 * FSIZE, // 每个点的信息所占的bytes
  0
);
gl.vertexAttribPointer(
  a_color,
  3, // size，attribute变量的长度(vec3)
  gl.FLOAT,
  false,
  5 * FSIZE,
  2 * FSIZE
);
// 5 确认赋值
gl.enableVertexAttribArray(a_position);
gl.enableVertexAttribArray(a_color);

gl.drawArrays(gl.TRIANGLES, 0, 3);
