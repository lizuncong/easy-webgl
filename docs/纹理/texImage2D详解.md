## texImage2D方法的使用及详解
texImage2D 是 WebGL 中用于上传二维纹理数据到 GPU 的核心函数。它允许开发者从多种数据源（如图片、Canvas、TypedArray）创建纹理，并控制纹理的存储格式和行为


### WebGL `texImage2D` 函数详细解读

`texImage2D` 是 WebGL 中用于上传二维纹理数据到 GPU 的核心函数。它允许开发者从多种数据源（如图片、Canvas、TypedArray）创建纹理，并控制纹理的存储格式和行为。以下是每个参数的详细说明：

---

#### **1. `target`**
• **类型**: GLenum
• **作用**: 指定纹理的目标类型，决定如何处理后续参数。
• **常见值**:
  • `gl.TEXTURE_2D`：标准的二维纹理（默认）。
  • `gl.TEXTURE_CUBE_MAP_POSITIVE_X` 等：立方体贴图面（需配合 `level` 使用多个 `texImage2D` 调用）。
• **注意**:  
  当 `target` 是立方体贴图时，`width` 和 `height` 应相同，且每个面需单独调用 `texImage2D`。

---

#### **2. `level`**
• **类型**: GLint
• **作用**: 指定纹理的 **mipmap 级别**。0 表示基础级别，高级别用于纹理缩放时的细节优化。
• **常见值**: `0`（大多数情况）。
• **注意**:  
  若启用 mipmapping（`gl.generateMipmap`），需为每个 mipmap 级别调用 `texImage2D`。

level指的是纹理的mipmap级别，用于纹理的细节层次。当纹理被缩放时，WebGL会使用这些预先生成的mipmap级别来提高渲染效率并减少锯齿。每个mipmap级别的尺寸是前一级别的一半，直到1x1

在 WebGL 中，level 参数表示纹理的 ​Mipmapping 层级，用于控制纹理在不同缩放比例下的细节表现。它通过预生成多级分辨率的纹理（从原始尺寸逐步缩小到 1x1），在渲染时根据物体距离动态选择合适的层级，从而平衡性能和视觉效果


比如，远处山体的纹理使用 Level 2（低分辨率），近处的树木使用 Level 0（原始分辨率）。

---

#### **3. `internalFormat`**
• **类型**: GLenum
• **作用**: 定义纹理在 GPU 内部的存储格式，直接影响性能和功能。
• **常见值**:
  • **颜色格式**:
    ◦ `gl.RGBA8`：8位/通道，支持 Alpha 通道。
    ◦ `gl.RGB565`：5位红、6位绿、5位蓝，无 Alpha。
    ◦ `gl.LUMINANCE8`：仅亮度通道，8位。
  • **深度/ stencil 格式**:
    ◦ `gl.DEPTH_COMPONENT16`：16位深度缓冲。
    ◦ `gl.DEPTH_STENCIL8`：8位深度 + 8位 stencil。
  • **压缩格式**（需浏览器支持）:
    ◦ `gl.COMPRESSED_RGBA_S3TC`：S3TC 压缩格式。
    ◦ `gl.COMPRESSED_RGB_ETC1`：ETC1 压缩格式（移动端常用）。
• **注意**:
  • 压缩格式需确保 `width` 和 `height` 是 **4 的倍数**（某些格式要求）。
  • 不同格式的 `data` 结构不同（如压缩格式需二进制数据）。

---

#### **4. `width`**
• **类型**: GLsizei
• **作用**: 纹理的像素宽度（必须 ≥ 1）。
• **注意**:
  • **非 2 的幂次方纹理**：WebGL 1.0 要求 `width` 和 `height` 是 2 的幂次方，但 WebGL 2.0 支持非幂次方纹理（需检查 `gl.getTexParameter` 返回值）。
  • **压缩纹理**：部分格式（如 `COMPRESSED_RGBA_S3TC`）要求 `width` 和 `height` 是 4 的倍数。

---

#### **5. `height`**
• **类型**: GLsizei
• **作用**: 纹理的像素高度（必须 ≥ 1）。
• **注意**: 规则与 `width` 完全相同。

---

#### **6. `border`**
• **类型**: GLint
• **作用**: 是否启用边框（仅影响 `gl.texSubImage2D`，对 `texImage2D` 无效）。
• **默认值**: `0`（无边框）。
• **注意**:  
  基本用法中可忽略此参数，仅在高级纹理操作中可能用到。

---

#### **7. `data`**
• **类型**: ArrayBufferView | ImageData | HTMLCanvasElement | HTMLImageElement | SVGImageElement
• **作用**: 包含纹理像素数据的源。
• **常见类型**:
  • **TypedArray**（如 `Uint8Array`）：直接像素数据。
  • **ImageData**：通过 `canvas.getImageData()` 获取。
  • **HTMLImage/Canvas**：异步加载后需调用 `drawImage` 到临时 Canvas，再提取数据。
• **注意**:
  • 数据格式必须与 `internalFormat` 匹配（如 `RGBA8` 对应 4 字节/像素）。
  • 异步加载图片时，需在 `onload` 事件中调用 `texImage2D`。

---

#### **8. `offset`**
• **类型**: GLintptr
• **作用**: 数据缓冲区的起始偏移量（高级用法，通常设为 `0`）。
• **默认值**: `0`。

---

#### **9. `format`**
• **类型**: GLenum
• **作用**: 指定数据中各通道的排列顺序（仅当 `data` 是 TypedArray 时有效）。 指定 texel 数据格式。在 WebGL 1 中，它必须与 internalformat 相同（查看上面). 在 WebGL 2 中，这张表中列出了这些组合。
• **常见值**:
  • `gl.RGBA`：红、绿、蓝、Alpha。
  • `gl.RGB`：仅红、绿、蓝（Alpha 被忽略或填充 1）。
  • `gl.LUMINANCE`：仅亮度。
• **注意**:
  需与 `internalFormat` 和 `data` 的字节顺序一致。

---

#### **10. `type`**
• **类型**: GLenum
• **作用**: 指定数据中每个通道的位数和类型（仅当 `data` 是 TypedArray 时有效）。
• **常见值**:
  • `gl.UNSIGNED_BYTE`：8 位无符号整数（默认）。
  • `gl.FLOAT`：32 位浮点数（用于 HDR 等高级场景）。
• **注意**:
  不支持的类型会抛出 `INVALID_ENUM` 错误。

---

### **完整调用示例**
```javascript
// 创建纹理对象
const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);

// 加载图片并上传纹理
const img = new Image();
img.onload = () => {
  gl.texImage2D(
    gl.TEXTURE_2D,            // target
    0,                       // level
    gl.RGBA8,                 // internalFormat
    img.width,                // width
    img.height,               // height
    0,                       // border
    gl.RGBA,                  // format
    gl.UNSIGNED_BYTE,          // type
    img                       // data（HTMLImageElement）
  );
  
  // 启用 mipmap（可选）
  gl.generateMipmap(gl.TEXTURE_2D);
};
img.src = "texture.png";
```

---

### **常见问题与注意事项**
1. **纹理尺寸问题**:
   • WebGL 1.0 要求 `width` 和 `height` 是 2 的幂次方，但 WebGL 2.0 支持非幂次方纹理。可通过 `gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_WIDTH)` 检查是否支持。
   
2. **压缩纹理兼容性**:
   • S3TC、ETC1 等压缩格式需要浏览器支持（如通过 `Modernizr` 检测）。

3. **性能优化**:
   • 优先使用压缩格式（如 `COMPRESSED_RGBA_S3TC`）减少带宽和内存占用。
   • 根据需求选择合适的内部格式（如 `gl.RGB565` 节省内存，但无 Alpha）。

4. **异步加载**:
   • 图片加载是异步的，需确保 `texImage2D` 在 `onload` 回调中调用，避免纹理为空。

5. **错误处理**:
   • 使用 `gl.getError()` 检查参数合法性（如无效的 `internalFormat`）。

---

通过合理配置 `texImage2D` 的参数，开发者可以高效管理纹理资源，平衡性能与视觉效果。理解每个参数的作用是优化 WebGL 应用的关键步骤。