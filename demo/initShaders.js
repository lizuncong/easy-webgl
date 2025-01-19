function createShader(gl, type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  // compile shader result
  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (compiled) {
    return shader;
  } else {
    const error = gl.getShaderInfoLog(shader);
    console.log("【compile shaders error】：", error);
    gl.deleteShader(shader);
    return null;
  }
}
function createProgram(gl, vertexShader, fragmentShader) {
  // 一个webgl程序可以有多个program
  let program = gl.createProgram();

  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (linked) {
    return program;
  } else {
    const error = gl.getProgramInfoLog(program);
    console.log("link program error：", error);
    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    return null;
  }

  return program;
}

function initShaders(gl, vertexSource, fragmentSource) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = createProgram(gl, vertexShader, fragmentShader);
  if (program) {
    // gl.useProgram(program);
    return program;
  } else {
    console.log("Failed to create program.");
    return null;
  }
}



