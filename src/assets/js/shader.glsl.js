window.shaderSource = `
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    float r = 0.5 + 0.5 * sin(u_time + uv.x * 3.14);
    float g = 0.5 + 0.5 * sin(u_time * 0.7 + uv.y * 6.28);
    float b = 0.5 + 0.5 * sin(u_time * 1.3);

    gl_FragColor = vec4(r, g, b, 1.0);
}
`;
