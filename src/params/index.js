import initShaders from "./initShaders.js";

const canvas = document.getElementById("webgl");
const gl = canvas.getContext("webgl");

let vertexSource = `
    attribute vec2 a_position;
    void main(){
        gl_Position = vec4(a_position, 0.0, 1.0);
        gl_PointSize = 30.0;
    }
`;

let fragmentSource = `
    void main(){
        gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
    }
`;

const program = initShaders(gl, vertexSource, fragmentSource);

console.log("program...", program);
// 清空canvas画布
gl.clearColor(0.5, 0.5, 0.5, 1.0); // rgba()
gl.clear(gl.COLOR_BUFFER_BIT);

const position = [1, 0.0];

const location = gl.getAttribLocation(program, 'a_position')
console.log('location..', location)
// gl.vertexAttrib2f(location, ...position)
gl.vertexAttrib2fv(location, new Float32Array(position))

// 画一个点
gl.drawArrays(gl.POINTS, 0, 1);
