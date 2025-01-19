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