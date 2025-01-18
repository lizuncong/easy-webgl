export function resize(canvas) {
    // 获取浏览器中画布的显示尺寸
    var displayWidth = canvas.clientWidth;
    var displayHeight = canvas.clientHeight;

    // 检尺寸是否相同
    if (canvas.width != displayWidth ||
        canvas.height != displayHeight) {

        // 设置为相同的尺寸
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
}