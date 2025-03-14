### 属性在WebGL内部是怎么表示的？
如果用 JavaScript 实现，它们看起来可能像这样：

```js
// 伪代码
const gl = {
  arrayBuffer: null,
  attributeValues: [
    [0, 0, 0, 1],
    [0, 0, 0, 1],
    [0, 0, 0, 1],
    [0, 0, 0, 1],
    [0, 0, 0, 1],
    [0, 0, 0, 1],
    [0, 0, 0, 1],
    [0, 0, 0, 1],
 ],
  vertexArray: {
    attributes: [
      { enable: ?, type: ?, size: ?, normalize: ?, stride: ?, offset: ?, buffer: ?, divisor: 0, },
      { enable: ?, type: ?, size: ?, normalize: ?, stride: ?, offset: ?, buffer: ?, divisor: 0, },
      { enable: ?, type: ?, size: ?, normalize: ?, stride: ?, offset: ?, buffer: ?, divisor: 0, },
      { enable: ?, type: ?, size: ?, normalize: ?, stride: ?, offset: ?, buffer: ?, divisor: 0, },
      { enable: ?, type: ?, size: ?, normalize: ?, stride: ?, offset: ?, buffer: ?, divisor: 0, },
      { enable: ?, type: ?, size: ?, normalize: ?, stride: ?, offset: ?, buffer: ?, divisor: 0, },
      { enable: ?, type: ?, size: ?, normalize: ?, stride: ?, offset: ?, buffer: ?, divisor: 0, },
      { enable: ?, type: ?, size: ?, normalize: ?, stride: ?, offset: ?, buffer: ?, divisor: 0, },
    ],
    elementArrayBuffer: null,
  },
}
```

上面的伪代码中：

*   gl.arrayBuffer是全局变量，用来绑定目标缓冲区，就可以对缓冲区传输数据。
*   gl.vertexArray就是`顶点数组对象（VAO）`，WebGL全局只有一个顶点数组对象，所有的着色程序都会从这个顶点数组对象中读取属性。WebGL要求顶点数组对象至少支持8个属性，上面的伪代码只列举了8个属性，
    `vertexArray.attributes`数组中的每一项都表示一个属性，每个属性都有自己的状态，包括默认值。默认情况下，属性会从`attributeValues`中读取值。当我们调用`gl.vertexAttrib[1234]f[v]()`给属性设置值时，实际上修改的就是`attributeValues`中的值。gl.attributeValues和gl.vertexArray.attributes中的元素是对应的，比如gl.vertexArray.attributes\[0]会从gl.attributeValues\[0]中读取值。


### 属性默认值对象（gl.attributeValues）
WebGL内部只有一个gl.attributeValues对象，这意味着所有的着色程序将共用一个gl.attributeValues。这个对象用来存放属性的默认值。可以通过调用`gl.vertexAttrib[1234]f[v]()`修改这个对象的值。

通过调用const positionLocation1 = gl.getAttribLocation(program, 'a\_position1')，我们可以获取到属性`a_position1`在顶点数组`vertexArray.attributes`中的索引。

gl.vertexAttrib2f(positionLocation1, 0.5, 0.5)的伪代码如下：

```js
// 伪代码
gl.vertexAttrib2f = function(location, a, b) {
  const attrib = gl.attributeValues[location];
  attrib[0] = a;
  attrib[1] = b;
};
```

可以通过下面的代码验证两个着色程序共用一个attributeValues对象。


```js
  const canvas = document.getElementById('webgl')
  const gl = canvas.getContext('webgl')
  const vertexShaderSource1 = `
    attribute vec2 a_position1;
    void main() {
      gl_Position = vec4(a_position1, 0, 1);
      gl_PointSize = 10.0;
    }
  `
  const fragmentShaderSource1 = `
    precision mediump float;
    void main() {
      gl_FragColor = vec4(1,0,0.5,1);
    }
  `

  const vertexShaderSource2 = `
    attribute vec2 a_position2;
    void main() {
      float x2 = a_position2.x - 0.03;
      float y2 = a_position2.y;
      gl_Position = vec4(x2, y2, 0, 1);
      gl_PointSize = 10.0;
    }
  `
  const fragmentShaderSource2 = `
    precision mediump float;
    void main() {
      gl_FragColor = vec4(0,0,0,1);
    }
  `
  const program1 = initShaders(gl, vertexShaderSource1, fragmentShaderSource1)
  const program2 = initShaders(gl, vertexShaderSource2, fragmentShaderSource2)

  const positionLocation1 = gl.getAttribLocation(program1, 'a_position1')
  // 修改attributeValues的值，共用的
  gl.vertexAttrib2f(positionLocation1, 0.5, 0.5)



  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT);

  

  // 使用第一个着色程序绘制粉色的点
  gl.useProgram(program1)
  gl.drawArrays(gl.POINTS, 0, 1)

  // 切换到第二个着色程序，绘制黑色的点。
  gl.useProgram(program2)
  gl.drawArrays(gl.POINTS, 0, 1)
```


效果如下：


![image](../../easy-webgl/attri_05.jpg)



可以看到两个点挨着。但我们只通过`gl.vertexAttrib2f(positionLocation1, 0.5, 0.5)`修改过属性`a_position1`的值，也就是修改了`attributeValues[0]`的值。默认情况下，属性会从`attributeValues`中读取值，因此即使我们没有修改过`a_position2`的值，它也会从`attributeValues[0]`中读值，而`attributeValues[0]`已经被`a_position1`修改成`[0.5,0.5,0,1]`，因此`a_position2`读出来的也是`[0.5,0.5,0,1]`

### WebGL顶点数组对象(VAO)

WebGL内部只有一个顶点数组对象，即gl.vertexArray。但WebGL提供了`OES_vertex_array_object`扩展允许我们创建，替换vertexArray。比如在WebGL2中我们可以这样替换：

```js
var vao = gl.createVertexArray();
gl.bindVertexArray(vao);
```

如果用伪代码实现，如下所示：

```js
gl.bindVertexArray = function(vao) {
   gl.vertexArray = vao ? vao : defaultVAO;
};
```

我们来实践一下替换VAO，首先看下面的代码：


```js
  const canvas = document.getElementById('webgl')
  // 记得获取的是webgl2上下文
  const gl = canvas.getContext('webgl2')

  const vertexShaderSource = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0, 1);
      gl_PointSize = 10.0;
    }
  `
  const fragmentShaderSource = `
    precision mediump float;
    void main() {
      gl_FragColor = vec4(1,0,0.5,1);
    }
  `

  const program = initShaders(gl, vertexShaderSource, fragmentShaderSource)
  const positionLocation = gl.getAttribLocation(program, 'a_position')

  gl.useProgram(program)
  gl.vertexAttrib2f(positionLocation, 0.0, 0.5)

  // 打开的是defaultVAO中的positionLocation属性，即默认的VAO的属性的状态。
  gl.enableVertexAttribArray(positionLocation)

  // var vao = gl.createVertexArray();
  // gl.bindVertexArray(vao);
  gl.drawArrays(gl.POINTS, 0, 1)
```

在上面的代码中，我们先调用gl.vertexAttrib2f修改gl.attributeValues中的值。然后调用gl.enableVertexAttribArray(positionLocation)将positionLocation属性的enable状态打开。注意，这里打开的是`defaultVAO`的属性，即defaultVAO.attributes\[positionLocation].enable = true。这里一旦打开，那么意味着属性positionLocation需要从缓冲中读取值（后面会分析这个），而我们又没有提供缓冲数据，因此WebGL渲染应该是要出错的，结果如下：

![image](../../easy-webgl/attri_06.jpg)


如果我们将createVertexArray那两行代码的注释去掉，如下面所示：

```js
  const canvas = document.getElementById('webgl')
  // 记得获取的是webgl2上下文
  const gl = canvas.getContext('webgl2')

  const vertexShaderSource = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0, 1);
      gl_PointSize = 10.0;
    }
  `
  const fragmentShaderSource = `
    precision mediump float;
    void main() {
      gl_FragColor = vec4(1,0,0.5,1);
    }
  `

  const program = initShaders(gl, vertexShaderSource, fragmentShaderSource)
  const positionLocation = gl.getAttribLocation(program, 'a_position')

  gl.useProgram(program)
  gl.vertexAttrib2f(positionLocation, 0.0, 0.5)

  // 打开的是defaultVAO中的positionLocation属性，即默认的VAO的属性的状态。
  gl.enableVertexAttribArray(positionLocation)

  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.drawArrays(gl.POINTS, 0, 1)
```


可以发现，正常渲染，结果如下，并且是在坐标(0.0, 0.5)处绘制的。这是因为我们调用`gl.enableVertexAttribArray`打开的是defaultVAO的属性，如果不提供缓冲数据，是会报错的。但后面我们又调用gl.bindVertexArray绑定新的VAO，然后新的VAO没有打开从缓冲读取数据的属性，默认从属性默认值对象取值。这也从侧面反映出，即使切换不同的VAO，属性还是会共用同一个gl.attributeValues对象

![image](../../easy-webgl/attri_07.jpg)


> 当WebGL绘制时，会从顶点数组对象中查找positionLocation属性，而新的顶点数组对象VAO.attributes\[positionLocation].enable默认为false，即从属性默认值对象(gl.attributeValues对象)中读取值，而gl.attributeValues\[positionLocation]已经被修改成\[0.0,0.5,0,1]，所以WebGL将会在坐标(0.0, 0.5)处绘制一个点

> 既然顶点数组对象中的属性attributes是个数组，那么相应的就有大小，可以通过gl.getParameter(gl.MAX\_VERTEX\_ATTRIBS)获取WebGL支持的属性数量

关于顶点数组对象(VAO)和attributeValues也可以通过下图直观感受到


![image](../../easy-webgl/attri_08.webp)


下图中，vertex array中attributes前三个属性的enable都为true，对应的，左边Attribute Values中前三个值都被置灰了，表示不可读取



![image](../../easy-webgl/attri_09.webp)


### 顶点数组对象(VAO)有什么好处？

为什么WebGL提供了扩展允许我们创建并替换VAO？实际上，这在一些业务场景中比较常用。这部分需要完善实战的应用场景及案例

以下内容援引自GPT的回答，无从考证，仅供参考。

WebGL是一种用于在网页上进行高性能3D图形渲染的技术，VAO（Vertex Array Object，顶点数组对象）则是WebGL中管理顶点数据的重要机制。WebGL提供扩展允许创建并替换VAO，主要基于性能优化、灵活性提升、资源管理以及跨平台和兼容性等多方面的考量，这为开发者带来了诸多好处：
1. **性能优化**
    - **减少状态切换开销**：在3D渲染中，顶点数据的配置和绑定操作频繁且复杂。如果没有VAO，每次渲染不同的几何图形时，都需要重复设置顶点属性指针、缓冲区绑定等大量状态。使用VAO，这些状态可以预先存储在VAO对象中，渲染时只需绑定对应的VAO，就能快速切换到所需的顶点数据配置，大大减少了状态切换的开销，提高渲染效率。例如在一个包含多个复杂模型的3D场景中，每个模型都有不同的顶点数据布局，通过VAO可以快速切换模型的顶点数据配置，避免了重复设置带来的性能损耗。
    - **批处理渲染**：VAO的创建和替换机制有助于实现批处理渲染。批处理可以将多个较小的渲染任务合并为一个较大的渲染操作，减少GPU与CPU之间的数据传输次数。比如在渲染大量相似的小物体（如草丛中的草叶）时，可以将这些物体的顶点数据存储在不同的VAO中，然后通过批量绑定和渲染这些VAO，一次性提交给GPU处理，显著提高渲染性能。
2. **灵活性提升**
    - **动态更新顶点数据**：在实际应用中，顶点数据可能需要根据用户交互、动画效果或实时数据进行动态更新。通过创建并替换VAO，开发者可以轻松地为同一物体或不同物体切换不同的顶点数据配置。例如在制作一个角色动画时，角色的骨骼动画会导致顶点数据不断变化，利用VAO的替换功能，可以及时更新顶点数据，实现流畅的动画效果。
    - **适应不同渲染需求**：不同的渲染场景和特效可能需要不同的顶点数据组织方式。比如在渲染一个带有光照效果的模型时，可能需要顶点数据包含法线信息；而在进行简单的线框渲染时，只需要顶点坐标信息。通过创建和替换VAO，开发者可以快速切换到满足不同渲染需求的顶点数据配置，增强了渲染的灵活性。
3. **资源管理**
    - **复用顶点数据资源**：在复杂的3D场景中，可能存在多个物体共享部分顶点数据的情况。通过创建VAO，可以将这些共享的顶点数据存储在一个VAO中，不同的物体只需引用该VAO即可，避免了顶点数据的重复存储，节省了内存资源。例如在一个城市场景中，许多建筑物的墙面可能使用相同的顶点数据来表示纹理坐标和顶点位置，通过复用VAO，可以有效减少内存占用。
    - **高效管理内存**：当不再需要某些顶点数据时，可以方便地通过替换或删除VAO来释放相关的内存资源。这在长时间运行的WebGL应用程序中尤为重要，有助于防止内存泄漏，确保应用程序的稳定运行。
4. **跨平台和兼容性**
    - **统一渲染接口**：WebGL需要在不同的浏览器和操作系统上保持一致的渲染效果。通过提供扩展来创建和替换VAO，为开发者提供了一个统一的接口来管理顶点数据，无论在何种平台上，都能以相同的方式进行顶点数据的配置和渲染，提高了应用程序的跨平台兼容性。
    - **适应硬件差异**：不同的硬件设备对顶点数据的处理能力和优化方式可能有所不同。VAO的扩展机制允许开发者根据硬件特性，创建最适合该硬件的顶点数据配置。例如，某些高端显卡可能更擅长处理大规模的顶点数据，开发者可以通过创建大型的VAO来充分利用硬件性能；而对于一些低端设备，则可以创建较小、更精简的VAO，以避免硬件过载，确保应用程序在各种设备上都能流畅运行。 