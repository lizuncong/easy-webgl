import initShaders from "./initShaders.js";
import vertexSource from "./shaders/vertexShader.js";
import fragmentSource from "./shaders/fragmentShader.js";
const canvas = document.getElementById("webgl");
const gl = canvas.getContext("webgl");

const program = initShaders(gl, vertexSource, fragmentSource);

function initVertexBuffers() {
  // 4个点的坐标信息-形状的4个顶点
  let position = new Float32Array([
    -0.5, -0.5, 0.0, 0.5, -0.5, 0.0, 0.5, 0.5, 0.0, -0.5, 0.5, 0.0,
  ]);

  // 4个点的信息-图片的4个顶点
  // let uvs = new Float32Array([
  //   0.0, 0.0,
  //   1.0, 0.0,
  //   1.0, 1.0,
  //   0.0, 1.0
  // ]);
  let uvs = new Float32Array([
    0.0,
    0.0,
    1.0,
    0.0, // 设置为2后，相当于把图片缩小了
    1.0,
    1.0,
    0.0,
    1.0,
  ]);
  const FSIZE = position.BYTES_PER_ELEMENT;

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW);

  const a_position = gl.getAttribLocation(program, "a_position");
  gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 3 * FSIZE, 0);
  gl.enableVertexAttribArray(a_position);

  const uvsBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);

  const a_uv = gl.getAttribLocation(program, "a_uv");
  gl.vertexAttribPointer(a_uv, 2, gl.FLOAT, false, 2 * FSIZE, 0);
  gl.enableVertexAttribArray(a_uv);
}

initVertexBuffers();

function initTextures() {
  let texture1 = gl.createTexture();
  let texture2 = gl.createTexture();

  let u_sampler1 = gl.getUniformLocation(program, "u_sampler1");
  let u_sampler2 = gl.getUniformLocation(program, "u_sampler2");

  let image1 = new Image();
  //image.src = 'http://localhost:8080/400.jpeg' // 如果加载的图片尺寸不是2的N次方，那么下面重复方式只能设置成CLAMP_TO_EDGE
  image1.src = "http://localhost:8080/512.jpeg"; // 如果加载的图片尺寸不是2的N次方，那么下面重复方式只能设置成CLAMP_TO_EDGE

  let image2 = new Image();
  image2.src = "./m_512.jpeg";
  // 异步的过程：图片加载完成之后执行这个函数里的任务
  image1.onload = function () {
    // 翻转图片的Y轴,默认是不翻转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.activeTexture(gl.TEXTURE0); //激活贴图，放在第0个单元上（最少可以支持8个单元）
    gl.bindTexture(gl.TEXTURE_2D, texture1); //绑定贴图：哪种贴图和哪个贴图

    // 对贴图的参数进行设置gl.texParameteri(贴图的种类，参数的名称，具体值)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
    // 贴图用哪张图片，即用image作为texture
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image1);

    gl.uniform1i(u_sampler1, 0);

    draw(gl);
  };

  image2.onload = function () {
    // 翻转图片的Y轴,默认是不翻转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.activeTexture(gl.TEXTURE1); //激活贴图，放在第0个单元上（最少可以支持8个单元）
    gl.bindTexture(gl.TEXTURE_2D, texture2); //绑定贴图：哪种贴图和哪个贴图

    // 对贴图的参数进行设置gl.texParameteri(贴图的种类，参数的名称，具体值)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
    // 贴图用哪张图片，即用image作为texture
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image2);

    gl.uniform1i(u_sampler2, 1); // 第二个参数和gl.activeTexture对应

    draw(gl);
  };
}

initTextures();

function draw() {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  gl.drawArrays(gl.POINTS, 0, 4);
}
