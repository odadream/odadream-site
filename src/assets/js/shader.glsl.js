window.shaders = {

  // 1 — мягкий градиент + hover яркость + click вспышка
  1: `
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_hover;
uniform float u_click;
uniform float u_seed;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float t = u_time * 0.3 + u_seed;

  vec3 col = vec3(
    0.5 + 0.5 * sin(t + uv.x * 3.0),
    0.5 + 0.5 * sin(t * 0.7 + uv.y * 5.0),
    0.5 + 0.5 * sin(t * 1.3)
  );

  col += u_hover * 0.3;
  col += u_click * 0.6;

  gl_FragColor = vec4(col, 1.0);
}
`,

  // 2 — FBM шум + hover увеличивает контраст + click делает вспышку синего
  2: `
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_hover;
uniform float u_click;
uniform float u_seed;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  float a=hash(i), b=hash(i+vec2(1,0)), c=hash(i+vec2(0,1)), d=hash(i+vec2(1,1));
  vec2 u=f*f*(3.-2.*f);
  return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
}
float fbm(vec2 p){
  float v=0., a=0.5;
  for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.; a*=0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float t = u_time * 0.1 + u_seed;

  float n = fbm(uv * 3.0 + t);

  float contrast = mix(1.0, 2.0, u_hover);
  n = pow(n, contrast);

  vec3 col = vec3(n * 0.2, n * 0.5, n);

  col += vec3(0.0, 0.2, 0.8) * u_click;

  gl_FragColor = vec4(col, 1.0);
}
`,

  // 3 — мрамор + hover делает волны быстрее + click делает белую вспышку
  3: `
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_hover;
uniform float u_click;
uniform float u_seed;

void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float speed = mix(1.0, 3.0, u_hover);
  float t = u_time * 0.4 * speed + u_seed;

  float m = sin((uv.x + uv.y * 0.5 + sin(t)) * 10.0) * 0.5 + 0.5;

  vec3 col = mix(vec3(0.9,0.8,0.6), vec3(0.2,0.1,0.05), m);

  col += u_click * 0.5;

  gl_FragColor = vec4(col, 1.0);
}
`,

  // 4 — волны + hover увеличивает амплитуду + click делает всплеск
  4: `
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_hover;
uniform float u_click;
uniform float u_seed;

void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy - 0.5;
  uv.x *= u_resolution.x / u_resolution.y;

  float amp = mix(0.2, 0.5, u_hover);
  float t = u_time * 0.8 + u_seed;

  float w = sin(uv.x * 10.0 + t) * amp;
  float w2 = sin(uv.y * 12.0 - t) * amp;

  vec3 col = vec3(w + w2 + 0.5);

  col += vec3(1.0, 0.3, 0.1) * u_click;

  gl_FragColor = vec4(col, 1.0);
}
`,

  // 5 — огонь + hover усиливает жар + click вспышка огня
  5: `
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_hover;
uniform float u_click;
uniform float u_seed;

float rand(vec2 c){ return fract(sin(dot(c, vec2(12.9898,78.233))) * 43758.5453); }

void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float t = u_time * 1.5 + u_seed * 10.0;

  float flames = smoothstep(0.2, 1.0, sin((uv.y * 10.0 - t) + rand(floor(uv * 50.0)) * 2.0));

  flames = mix(flames, flames * 1.5, u_hover);

  vec3 col = mix(vec3(0.05,0.02,0.0), vec3(1.0,0.4,0.0), flames);

  col += vec3(1.0,0.5,0.2) * u_click;

  gl_FragColor = vec4(col, 1.0);
}
`,

  // 6 — стекло + hover увеличивает блик + click делает вспышку голубого
  6: `
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_hover;
uniform float u_click;
uniform float u_seed;

void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy - 0.5;
  float d = length(uv);

  float t = u_time * 0.8 + u_seed;

  float spec = smoothstep(0.4, 0.0, d - 0.1 * sin(t * 2.0));

  spec = mix(spec, spec * 2.0, u_hover);

  vec3 col = vec3(0.05,0.08,0.12) + vec3(0.6,0.8,1.0) * spec;

  col += vec3(0.2,0.4,1.0) * u_click;

  gl_FragColor = vec4(col, 1.0);
}
`,

  // 7 — клеточный шум + hover меняет палитру + click делает вспышку
  7: `
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_hover;
uniform float u_click;
uniform float u_seed;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }

void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy * 6.0 + u_seed;

  float c = hash(floor(uv));

  vec3 base = vec3(fract(c * 3.14), fract(c * 1.618), fract(c * 2.718));

  vec3 col = mix(base, vec3(1.0 - base), u_hover);

  col += vec3(1.0,1.0,1.0) * u_click;

  gl_FragColor = vec4(col, 1.0);
}
`,

  // 8 — цифровой шум + hover ускоряет мерцание + click вспышка
  8: `
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_hover;
uniform float u_click;
uniform float u_seed;

void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  float speed = mix(1.0, 5.0, u_hover);

  float t = floor(mod(u_time * speed + u_seed * 10.0, 10.0));

  float v = step(0.5, fract(sin(dot(uv * 100.0 + t, vec2(12.9898,78.233))) * 43758.5453));

  vec3 col = mix(vec3(0.05), vec3(0.95,0.95,0.2), v);

  col += vec3(1.0,1.0,0.3) * u_click;

  gl_FragColor = vec4(col, 1.0);
}
`,

  // 9 — плазма + hover увеличивает насыщенность + click вспышка
  9: `
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_hover;
uniform float u_click;
uniform float u_seed;

void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float t = u_time * 0.5 + u_seed;

  vec3 col = vec3(
    sin(uv.x * 10.0 + t),
    sin(uv.y * 8.0 + t * 1.3),
    sin((uv.x + uv.y) * 6.0 + t * 0.7)
  );

  col = 0.5 + 0.5 * col;

  col = mix(col, col * 2.0, u_hover);

  col += vec3(1.0,0.2,0.2) * u_click;

  gl_FragColor = vec4(col, 1.0);
}
`
};
