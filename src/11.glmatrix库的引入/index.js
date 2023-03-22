import initShaders from "./initShaders.js";

const { mat4 } = glMatrix


const canvas = document.getElementById("webgl");
const gl = canvas.getContext("webgl");

let vertexSource = `
    attribute vec2 a_position;
    varying vec3 v_color;
    attribute vec3 a_color;

    uniform mat4 u_matrix;
    void main(){
      
        v_color = a_color;
        gl_Position = u_matrix * vec4(a_position, 0.0, 1.0);
        gl_PointSize = 10.0;
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
function initVertexBuffers(gl, n) {
  let vertices = [
    // x y  r g b 前面两个代表坐标，后面三个代表颜色rgb的值
    -0.5, 0.5, 1.0, 0.0, 0.0,  // 
    -0.5, -0.5, 0.0, 1.0, 0.0,  //
    0.5, -0.5, 0.0, 0.0, 1.0, //
  ];

  vertices = new Float32Array(vertices);
  const FSIZE = vertices.BYTES_PER_ELEMENT; // 一个点4个字节

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
  const a_color = gl.getAttribLocation(program, "a_color");
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
}
let n = 3; // 绘制4个点
initVertexBuffers(gl, n)


/**
 * 变换：平移translate、旋转rotate、缩放scale
 * [x1, y1, z1]为旧坐标
 * [x2, y2, z2]为（旋转）变换后的新坐标
 * 
 * x2 = x1 * cosB - y1 * sinB
 * y2 = x1 * sinB + y1 * cosB
 * z2 = z1
*/
const draw = () => {
  // 清空canvas画布
  gl.clearColor(0.5, 0.5, 0.5, 1.0); // rgba()
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
}

// 缩放矩阵
// const sx = 0.5, sy = 0.5, sz = 1;
// const scale_matrix = [
//   sx, 0, 0, 0,
//   0, sy, 0, 0,
//   0, 0, sz, 0,
//   0, 0, 0, 1
// ]
const scale_matrix = mat4.create();
mat4.fromScaling(scale_matrix, [0.5, 0.5, 1])

// 平移矩阵
// const tx = 1, ty = 0, tz = 0;
// const translate_matrix = [
//   1, 0, 0, 0,
//   0, 1, 0, 0,
//   0, 0, 1, 0,
//   tx, ty, tz, 1
// ]
const translate_matrix = mat4.create()
mat4.fromTranslation(translate_matrix, [0.5,0.5,0]);

// 旋转矩阵
let deg = 60;
// const cosB = Math.cos(deg / 180 * Math.PI)
// const sinB = Math.sin(deg / 180 * Math.PI)
// const rotate_matrix = [
//   cosB, sinB, 0, 0,
//   -sinB, cosB, 0, 0,
//   0, 0, 1, 0,
//   0, 0, 0, 1
// ]
const rotate_matrix = mat4.create();
// mat4.fromRotation(rotate_matrix,  deg / 180 * Math.PI, [0, 0, 1])
// mat4.fromZRotation(rotate_matrix,  deg / 180 * Math.PI)
mat4.fromXRotation(rotate_matrix,  deg / 180 * Math.PI)


let u_matrix = gl.getUniformLocation(program, 'u_matrix')
// gl.uniformMatrix4fv(u_matrix, false, scale_matrix)
// gl.uniformMatrix4fv(u_matrix, false, translate_matrix)
gl.uniformMatrix4fv(u_matrix, false, rotate_matrix)

draw()




// 创建一个新的单位矩阵
// const matrix = mat4.create();

// 第一种方式：对原有的（单位）矩阵进行修改
// mat4.fromScaling(matrix, [sx, sy, sz])
// mat4.fromTranslation(matrix, [tx, ty, tz])
// mat4.fromRotation(matrix, deg, [x, y, z])

// 第二种方式：修改某个矩阵，生成另外一个新的矩阵
// const matrix1 = mat4.create()
// const matrix2 = mat4.create();
// mat4.scale(matrix2, matrix1, [sx, sy, sz])