const canvas = document.getElementById('webgl')

const gl = canvas.getContext('webgl')


gl.clearColor(0,0,0,1)
console.log('COLOR_BUFFER_BIT..', gl.COLOR_BUFFER_BIT)
gl.clear(gl.COLOR_BUFFER_BIT)