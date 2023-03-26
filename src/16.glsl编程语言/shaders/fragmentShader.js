let fragmentShader = /*glsl*/ `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_sampler1;
uniform sampler2D u_sampler2;

void main() {
    vec4 color1 = texture2D(u_sampler1, v_uv);
    vec4 color2 = texture2D(u_sampler2, v_uv);
    gl_FragColor = color1 * color2;
}
`;

export default fragmentShader;
