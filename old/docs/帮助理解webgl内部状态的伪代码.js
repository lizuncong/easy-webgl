gl = function () {
    // internal WebGL state
    let lastError;
    let arrayBuffer = null;
    let vertexArray = {
        elementArrayBuffer: null,
        attributes: [
            {
                enabled: false, type: gl.FLOAT, size: 3, normalized: false,
                stride: 0, offset: 0, value: [0, 0, 0, 1], buffer: null
            },
            {
                enabled: false, type: gl.FLOAT, size: 3, normalized: false,
                stride: 0, offset: 0, value: [0, 0, 0, 1], buffer: null
            },
            {
                enabled: false, type: gl.FLOAT, size: 3, normalized: false,
                stride: 0, offset: 0, value: [0, 0, 0, 1], buffer: null
            },
            {
                enabled: false, type: gl.FLOAT, size: 3, normalized: false,
                stride: 0, offset: 0, value: [0, 0, 0, 1], buffer: null
            },
            {
                enabled: false, type: gl.FLOAT, size: 3, normalized: false,
                stride: 0, offset: 0, value: [0, 0, 0, 1], buffer: null
            },
            //    ...
        ],
    }
    //    ...

    // Implementation of gl.bindBuffer.
    // note this function is doing nothing but setting 2 internal variables.
    this.bindBuffer = function (bindPoint, buffer) {
        switch (bindPoint) {
            case gl.ARRAY_BUFFER;
                arrayBuffer = buffer;
                break;
            case gl.ELEMENT_ARRAY_BUFFER;
                vertexArray.elementArrayBuffer = buffer;
                break;
            default:
                lastError = gl.INVALID_ENUM;
                break;
        }
    };
    // ...
}();


// implementation of gl.bufferData
// Notice you don't pass in a buffer. You pass in a bindPoint.
// The function gets the buffer one of its internal variable you set by
// previously calling gl.bindBuffer

this.bufferData = function(bindPoint, data, usage) {

    // lookup the buffer from the bindPoint
    var buffer;
    switch (bindPoint) {
    case gl.ARRAY_BUFFER;
        buffer = arrayBuffer;
        break;
    case gl.ELEMENT_ARRAY_BUFFER;
        buffer = vertexArray.elemenArrayBuffer;
        break;
    default:
        lastError = gl.INVALID_ENUM;
        break;
    }

    // copy data into buffer
    buffer.copyData(data);  // just making this up
    buffer.setUsage(usage); // just making this up
};

// 有4个函数可用于配置属性如何从缓冲区中获取数据。 
// gl.enableVertexAttribArray，gl.disableVertexAttribArray
// gl.vertexAttribPointer和gl.vertexAttrib??

this.enableVertexAttribArray = function(location) {
  const attribute = vertexArray.attributes[location];
  attribute.enabled = true;  // true means get data from attribute.buffer
};

this.disableVertexAttribArray = function(location) {
  const attribute = vertexArray.attributes[location];
  attribute.enabled = false; // false means get data from attribute.value
};

this.vertexAttribPointer = function(location, size, type, normalized, stride, offset) {
  const attribute = vertexArray.attributes[location];
  attribute.size       = size;       // num values to pull from buffer per vertex shader iteration
  attribute.type       = type;       // type of values to pull from buffer
  attribute.normalized = normalized; // whether or not to normalize
  attribute.stride     = stride;     // number of bytes to advance for each iteration of the vertex shader. 0 = compute from type, size
  attribute.offset     = offset;     // where to start in buffer.

  // IMPORTANT!!! Associates whatever buffer is currently *bound* to
  // "arrayBuffer" to this attribute
  attribute.buffer     = arrayBuffer;
};

this.vertexAttrib4f = function(location, x, y, z, w) {
  const attribute = vertexArray.attributes[location];
  attribute.value[0] = x;
  attribute.value[1] = y;
  attribute.value[2] = z;
  attribute.value[3] = w;
};
