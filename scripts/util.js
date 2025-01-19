const fs = require('fs');
const path = require('path');

/**
 * 按代码块拆分 Markdown 文件，并保留代码块内容及其类型
 * @param {string} filePath - Markdown 文件路径
 * @returns {Object[]} 拆分后的内容数组，每个元素包含 text 和 code 对象
 */
function splitMarkdownWithCodeAndType(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    // 正则表达式匹配代码块，捕获语言类型，但不消耗反引号
    const codeBlockRegex = /```(\w*)\s*\n([\s\S]*?)\n```/g;
    let match;
    let lastIndex = 0;
    const parts = [];

    while ((match = codeBlockRegex.exec(content)) !== null) {
        // 添加代码块之前的文本
        if (match.index > lastIndex) {
            parts.push({ text: content.slice(lastIndex, match.index).trim() });
        }

        const language = match[1] || 'unknown'; // 获取语言类型，默认为 'unknown'
        const codeContent = match[2].trim();     // 获取代码内容并去除首尾空白
        let str = '```'
        str = str + language + '\n' + codeContent + '\n' + '```';
        parts.push({ code: { language, content: str} });

        lastIndex = codeBlockRegex.lastIndex;
    }

    // 添加最后一个代码块之后的文本
    if (lastIndex < content.length) {
        parts.push({ text: content.slice(lastIndex).trim() });
    }

    // 过滤掉可能的空字符串
    return parts.filter(part => part.text || part.code);
}

const getMarkDownContent = (filePath) => {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content
}

//示例用法
// const markdownFilePath = '/Users/lzc/Documents/easy-webgl/docs/属性和缓冲/属性的赋值方式.md'
// try {
//     const markdownParts = splitMarkdownWithCodeAndType(markdownFilePath);
//     fs.writeFileSync('./test.jsx', `const data = ${JSON.stringify(markdownParts)}`)
//     console.log(`拆分后的部分数量: ${markdownParts.length}`);
//     markdownParts.forEach((part, index) => {
//         if (part.text) {
//             console.log(`\n--- 文本部分 ${index + 1} ---`);
//             console.log(part.text);
//         } else if (part.code) {
//             console.log(`\n--- 代码部分 ${index + 1} (${part.code.language}) ---`);
//             console.log(part.code.content);
//         }
//     });
// } catch (error) {
//     console.error('读取或处理文件时出错:', error);
// }

module.exports = {
    splitMarkdownWithCodeAndType,
    getMarkDownContent
};