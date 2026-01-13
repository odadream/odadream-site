// src/assets/js/grid.js
// Инициализация WebGL для каждой canvas-клетки.
// Берёт шейдер из window.shaders[index] (index: 1..9).
(function(){
  const canvases = Array.from(document.querySelectorAll('.shader-canvas'));
  if (!canvases.length) return;

  canvases.forEach((canvas, idx) => {
    const cellIndex = idx + 1; // 1..9
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    // Получаем фрагментный шейдер для этой клетки
    const fragmentSrc = (window.shaders && window.shaders[cellIndex]) ? window.shaders[cellIndex] : window.shaders[1];

    const vertexSrc = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    function compile(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error (cell ' + cellIndex + '):', gl.getShaderInfoLog(shader));
      }
      return shader;
    }

    const vs = compile(gl.VERTEX_SHADER, vertexSrc);
    const fs = compile(gl.FRAGMENT_SHADER, fragmentSrc);

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error (cell ' + cellIndex + '):', gl.getProgramInfoLog(program));
    }
    gl.useProgram(program);

    // Буфер квадрата
    const position = gl.getAttribLocation(program, 'a_position');
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const u_time = gl.getUniformLocation(program, 'u_time');
    const u_resolution = gl.getUniformLocation(program, 'u_resolution');
    const u_mouse = gl.getUniformLocation(program, 'u_mouse');
    const u_hover = gl.getUniformLocation(program, 'u_hover');
    const u_seed = gl.getUniformLocation(program, 'u_seed');

    // Seed: уникальное число для клетки
    const seed = (cellIndex * 0.61803398875) % 1.0;

    // Resize handling
    function resize() {
      const w = Math.max(1, Math.floor(canvas.clientWidth));
      const h = Math.max(1, Math.floor(canvas.clientHeight));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    }
    resize();
    window.addEventListener('resize', resize);

    // Mouse / hover
    let hover = 0.0;
    let mouse = [0,0];
    const parent = canvas.parentElement;
    parent.addEventListener('mouseenter', () => hover = 1.0);
    parent.addEventListener('mouseleave', () => hover = 0.0);
    parent.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse[0] = (e.clientX - rect.left);
      mouse[1] = (rect.height - (e.clientY - rect.top)); // flip Y to match gl_FragCoord
    });

    // Render loop
    function render(t) {
      resize();
      gl.clearColor(0,0,0,0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      if (u_time) gl.uniform1f(u_time, t * 0.001);
      if (u_resolution) gl.uniform2f(u_resolution, canvas.width, canvas.height);
      if (u_mouse) gl.uniform2f(u_mouse, mouse[0], mouse[1]);
      if (u_hover) gl.uniform1f(u_hover, hover);
      if (u_seed) gl.uniform1f(u_seed, seed);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  });
})();
