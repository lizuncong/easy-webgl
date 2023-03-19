import initShaders from "./initShaders.js";

const canvas = document.getElementById("webgl");
const gl = canvas.getContext("webgl");

let vertexSource = `
    attribute vec2 a_position;
    attribute vec3 a_color;
    uniform vec4 u_translate;
    varying vec3 v_color;
    void main(){
        v_color = a_color;
        gl_Position = vec4(a_position, 0.0, 1.0) + u_translate;
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


const draw = () => {
  // 清空canvas画布
  gl.clearColor(0.5, 0.5, 0.5, 1.0); // rgba()
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
}


let tx = 0.0, ty = 0.0;
let speed_x = 0.01, speed_y = 0.02;

const tick = () => {
  tx += speed_x;
  ty += speed_y;
  if(tx > 0.5 || tx < -0.5){
    speed_x *= -1
  }
  if(ty > 0.5 || ty < -0.5){
    speed_y *= -1
  }
  const u_translate = gl.getUniformLocation(program, 'u_translate')
  gl.uniform4f(u_translate, tx, ty, 0.0, 0.0)
  draw()
  requestAnimationFrame(tick)
}

tick();


