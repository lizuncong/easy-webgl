import initShaders from "./initShaders.js";


const main = () => {
    const canvas = document.getElementById('webgl')
    const gl = canvas.getContext('webgl')
    if (!gl) {
        return
    }
    console.log('gl...', gl)
    const vertexShaderSource = document.getElementById('vertex-shader-2d').text
    const fragmentShaderSource = document.getElementById('fragment-shader-2d').text

    const program = initShaders(gl, vertexShaderSource, fragmentShaderSource)

    const positionLocation = gl.getAttribLocation(program, 'a_position')

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    const positions = [
      0.0, 0.5,
      0,0, 0.0,
      0.5, 0.0  
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    gl.useProgram(program)

    // gl.enable
    console.log('location...', positionLocation)
}

main();