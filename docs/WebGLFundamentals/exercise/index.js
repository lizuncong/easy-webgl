import initShaders from "./initShaders.js";


// 本Demo演示uniform变量
// 全局变量在着色程序运行前赋值，在运行过程中全局有效。
// 在一次绘制中对所有顶点保持一致值
//在我们设置好使用这个着色程序后，可以设置刚才创建的全局变量的值。 
//gl.useProgram就与之前讲到的gl.bindBuffer相似，设置当前使用的着色程序。 
// 之后所有类似gl.uniformXXX格式的方法都是设置当前着色程序的全局变量。
// 全局变量在一次绘制过程中传递给着色器的值都一样，在下面的一个简单的例子中， 
//用全局变量给顶点着色器添加了一个偏移量
// 要注意的是全局变量属于单个着色程序，如果多个着色程序有同名全局变量，
//需要找到每个全局变量并设置自己的值。 
//我们调用gl.uniform???的时候只是设置了当前程序的全局变量，
//当前程序是传递给gl.useProgram 的最后一个程序
// uniform默认值为全部0
// WebGLRenderingContext.uniform[1234][fi][v]() 
//方法指定了 uniform 变量的值。所有在 ShaderProgram 对象中定义的，
//且激活的 uniform 变量在 ShaderProgram 执行 link 成功后被初始化为 0。
//它们将保留通过调用此方法分配给它们的值，直到再次将其初始化为 0 时，
//也就是 ShaderProgram 对象上发生下一次成功的 link 操作为止
const main = () => {
  const canvas = document.getElementById('webgl')
  const gl = canvas.getContext('webgl2')
  const vertexShaderSource1 = `
    attribute vec3 a_position;
    uniform vec4 u_offset;
    void main(){
        gl_PointSize = 10.0;
        gl_Position = vec4(a_position, 1.0) + u_offset;
    }
  `
  const fragmentShaderSource1 = `
    precision mediump float;
    void main(){
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `
  const program1 = initShaders(gl, vertexShaderSource1, fragmentShaderSource1)
  const positionLocation1 = gl.getAttribLocation(program1, 'a_position')
  const offsetLoc = gl.getUniformLocation(program1, 'u_offset')
  console.log('offsetLoc...', offsetLoc)
  // 由于uniform全局变量属于单个着色程序，因此在给uniform全局变量赋值前，一定要先
  // 调用gl.useProgram设置当前使用的着色程序，然后再设置值，所以下面的调用会报错
  // gl.uniform3f(offsetLoc, 0.3, 0.3, 0.3)
  let verticesInfo = [
    0.5, 0.0,
    0.0, 0.5,
    -0.5, 0.0
  ]
  verticesInfo = new Float32Array(verticesInfo)

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, verticesInfo, gl.STATIC_DRAW)


  gl.vertexAttribPointer(
    positionLocation1,
    2,
    gl.FLOAT,
    false,
    8,
    0
  );



  gl.enableVertexAttribArray(positionLocation1);

  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program1)
  // 由于声明u_offset的是vec4，需要4个分量，因此下面的代码调用gl.uniform3f会报错。
  // gl.uniform3f(offsetLoc, 0.3, 0.3, 0.3)
  gl.uniform4f(offsetLoc, 0.3, 0.3, 0.3, 0.0)

  // 告诉webgl绘制3个点
  gl.drawArrays(gl.POINTS, 0, 3)

}

main();
