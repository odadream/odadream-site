(function () {
  const canvases = Array.from(document.querySelectorAll(".shader-canvas"));
  if (!canvases.length) return;

  canvases.forEach((canvas) => {
    const cell = canvas.parentElement;
    const index = parseInt(cell.dataset.cell, 10);

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const fragmentSrc = window.shaders[index];

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
      return shader;
    }

    const vs = compile(gl.VERTEX_SHADER, vertexSrc);
    const fs = compile(gl.FRAGMENT_SHADER, fragmentSrc);

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const position = gl.getAttribLocation(program, "a_position");
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const u_time = gl.getUniformLocation(program, "u_time");
    const u_resolution = gl.getUniformLocation(program, "u_resolution");
    const u_hover = gl.getUniformLocation(program, "u_hover");
    const u_click = gl.getUniformLocation(program, "u_click");
    const u_seed = gl.getUniformLocation(program, "u_seed");

    let hover = 0.0;
    let click = 0.0;

    const seed = (index * 0.61803398875) % 1.0;

    cell.addEventListener("mouseenter", () => (hover = 1.0));
    cell.addEventListener("mouseleave", () => (hover = 0.0));

    cell.addEventListener("click", () => {
      click = 1.0;
      setTimeout(() => (click = 0.0), 150);
    });

    function resize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }

    resize();
    window.addEventListener("resize", resize);

    function render(t) {
      resize();

      gl.uniform1f(u_time, t * 0.001);
      gl.uniform2f(u_resolution, canvas.width, canvas.height);
      gl.uniform1f(u_hover, hover);
      gl.uniform1f(u_click, click);
      gl.uniform1f(u_seed, seed);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  });
})();
