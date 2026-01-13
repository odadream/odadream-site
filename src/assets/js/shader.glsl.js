// src/assets/js/shader.glsl.js
// Набор простых, надёжных шейдеров. Каждый — строка GLSL.
// window.shaders[index] -> фрагментный шейдер для клетки index (1..9)

window.shaders = {
  1: `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_seed;
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float t = u_time * 0.2 + u_seed;
  float r = 0.5 + 0.5 * sin(t + uv.x * 3.14);
  float g = 0.5 + 0.5 * sin(t * 0.7 + uv.y * 6.28);
  float b = 0.5 + 0.5 * sin(t * 1.3);
  gl_FragColor = vec4(r, g, b, 1.0);
}
`,

  2: `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_seed;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7))) * 43758.5453123);}
float noise(vec2 p){
  vec2 i=floor(p); vec2 f=fract(p);
  float a=hash(i), b=hash(i+vec2(1.0,0.0)), c=hash(i+vec2(0.0,1.0)), d=hash(i+vec2(1.0,1.0));
  vec2 u=f*f*(3.0-2.0*f);
  return mix(a,b,u.x)+ (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;
}
float fbm(vec2 p){
  float v=0.0, a=0.5;
  for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.0; a *= 0.5; }
  return v;
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv * 3.0 + u_seed;
  float n = fbm(p + u_time * 0.1);
  vec3 col = mix(vec3(0.05,0.07,0.12), vec3(0.2,0.6,0.9), n);
  gl_FragColor = vec4(col,1.0);
}
`,

  3: `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_seed;
float noise(vec2 p){
  return fract(sin(dot(p,vec2(12.9898,78.233))) * 43758.5453);
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float t = u_time * 0.6 + u_seed;
  float m = sin((uv.x+uv.y*0.5+sin(t))*10.0)*0.5+0.5;
  float marble = m + 0.2 * noise(uv*20.0 + t);
  vec3 a = vec3(0.9,0.8,0.6);
  vec3 b = vec3(0.2,0.1,0.05);
  vec3 col = mix(a,b, smoothstep(0.2,0.8,marble));
  gl_FragColor = vec4(col,1.0);
}
`,

  4: `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_seed;
void main(){
  vec2 uv = (gl_FragCoord.xy / u_resolution.xy) - 0.5;
  uv.x *= u_resolution.x / u_resolution.y;
  float t = u_time * 0.8 + u_seed;
  float w = sin(uv.x * 10.0 + t) * 0.5 + 0.5;
  float w2 = sin(uv.y * 12.0 - t*0.8) * 0.5 + 0.5;
  vec3 col = vec3(w, 0.3*w2, 1.0 - w*0.6);
  gl_FragColor = vec4(col,1.0);
}
`,

  5: `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_seed;
float rand(vec2 co){return fract(sin(dot(co.xy,vec2(12.9898,78.233)))*43758.5453);}
void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float t = u_time * 1.5 + u_seed*10.0;
  float flames = smoothstep(0.2,1.0, sin((uv.y*10.0 - t) + rand(floor(uv*50.0))*2.0));
  vec3 col = mix(vec3(0.05,0.02,0.0), vec3(1.0,0.4,0.0), flames);
  gl_FragColor = vec4(col,1.0);
}
`,

  6: `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_seed;
void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv - 0.5;
  float d = length(p);
  float t = u_time * 0.8 + u_seed;
  float spec = smoothstep(0.4, 0.0, d - 0.1*sin(t*2.0));
  vec3 base = vec3(0.05,0.08,0.12);
  vec3 glow = vec3(0.6,0.8,1.0) * spec;
  gl_FragColor = vec4(base + glow, 1.0);
}
`,

  7: `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_seed;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float cell(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  float n = hash(i);
  return n;
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy * 6.0 + u_seed;
  float c = cell(uv);
  vec3 col = vec3(fract(c*3.14), fract(c*1.618), fract(c*2.718));
  gl_FragColor = vec4(col,1.0);
}
`,

  8: `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_seed;
void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float t = u_time * 0.5 + u_seed;
  vec3 col = vec3(0.1,0.2,0.25) + 0.4 * vec3(sin(uv.x*10.0 + t), sin(uv.y*8.0 + t*1.3), sin((uv.x+uv.y)*6.0 + t*0.7));
  gl_FragColor = vec4(col,1.0);
}
`,

  9: `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_seed;
void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float t = floor(mod(u_time*2.0 + u_seed*10.0, 10.0));
  float v = step(0.5, fract(sin(dot(uv*100.0 + t, vec2(12.9898,78.233))) * 43758.5453));
  vec3 col = mix(vec3(0.05), vec3(0.95,0.95,0.2), v);
  gl_FragColor = vec4(col,1.0);
}
`
};
