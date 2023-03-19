import initShaders from "./initShaders.js";

const canvas = document.getElementById("webgl");
const gl = canvas.getContext("webgl");

let vertexSource = `
    attribute vec2 a_position;
    varying vec3 v_color;
    attribute vec3 a_color;
    uniform float cosB;
    uniform float sinB;
    void main(){
        float x1 = a_position.x;
        float y1 = a_position.y;
        float z1 = 0.0;
        float x2 = x1 * cosB - y1 * sinB;
        float y2 = x1 * sinB + y1 * cosB;
        float z2 = z1;
        v_color = a_color;
        gl_Position = vec4(x2, y2, z2, 1.0);
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


let deg = 0;
const tick = () => {
  const cosB = gl.getUniformLocation(program, 'cosB')
  const sinB = gl.getUniformLocation(program, 'sinB')

  deg++;
  gl.uniform1f(cosB, Math.cos(deg/180 * Math.PI))
  gl.uniform1f(sinB, Math.sin( deg / 180 * Math.PI))

  draw()
  requestAnimationFrame(tick)
}

tick();




