import initShaders from "./initShaders.js";

const canvas = document.getElementById("webgl");
const gl = canvas.getContext("webgl");

let vertexSource = `
    attribute vec2 a_position;
    uniform float u_size;
    varying vec2 v_position;
    void main(){
        v_position = a_position;
        gl_Position = vec4(a_position, 0.0, 1.0);
        gl_PointSize = u_size;
    }
`;

let fragmentSource = `
    precision mediump float;
    uniform vec3 u_color;
    varying vec2 v_position;
    void main(){
        gl_FragColor = vec4(u_color, 1.0);
    }
`;

const program = initShaders(gl, vertexSource, fragmentSource);

// 清空canvas画布
gl.clearColor(0.5, 0.5, 0.5, 1.0); // rgba()
gl.clear(gl.COLOR_BUFFER_BIT);

const a_position = gl.getAttribLocation(program, 'a_position')
gl.vertexAttrib2f(a_position, -0.6, 0.0)

const u_color = gl.getUniformLocation(program, 'u_color')
gl.uniform3f(u_color, 1.0, 1.0, 0.0)

const u_size = gl.getUniformLocation(program, 'u_size')
gl.uniform1f(u_size, 40.0)

// 画一个点
gl.drawArrays(gl.POINTS, 0, 1);
