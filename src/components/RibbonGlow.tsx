import { useEffect, useRef } from 'react'

const vertexShaderSource = `#version 300 es
in vec2 a_position;
out vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`

const fragmentShaderSource = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 outColor;

uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform vec2 u_velocity;
uniform float u_time;
uniform float u_presence;
uniform float u_reduced;

vec3 palette(float t) {
  vec3 a = vec3(0.87, 0.86, 0.78); // cream
  vec3 b = vec3(0.92, 0.70, 0.42); // warm gold
  vec3 c = vec3(0.64, 0.43, 0.25); // bronze
  float m = 0.5 + 0.5 * sin(t * 2.7);
  return mix(a, mix(b, c, 0.35 + 0.3 * sin(t * 1.3)), m);
}

void main() {
  vec2 uv = v_uv;
  vec2 p = (uv * 2.0 - 1.0);
  p.x *= u_resolution.x / max(u_resolution.y, 1.0);

  vec2 mp = (u_pointer * 2.0 - 1.0);
  mp.x *= u_resolution.x / max(u_resolution.y, 1.0);

  float t = u_time * mix(0.0, 0.16, 1.0 - u_reduced);
  vec2 toMouse = p - mp;
  float dMouse = length(toMouse);
  float influence = exp(-dMouse * 2.25) * u_presence;
  float twist = (u_velocity.x * toMouse.y - u_velocity.y * toMouse.x) * 0.035 * influence;

  float angle = -3.14159265 + 0.20 * sin(t * 0.4) + twist;
  mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  vec2 q = rot * (p + vec2(0.0, -0.02));
  q += u_velocity * 0.016 * influence;

  vec3 accum = vec3(0.0);
  float glow = 0.0;

  // 84 folded ribbon layers, inspired by OriginKit's Ribbon Glow field.
  for (int i = 0; i < 84; i++) {
    float fi = float(i);
    float phase = fi * 0.145;
    float spread = (fi - 41.5) / 41.5;

    vec2 r = q;
    r.x += 0.23 * sin(r.y * 1.75 + phase + t * 0.75);
    r.y += 0.16 * sin(r.x * 2.1 - phase * 0.72 - t * 0.52);

    // shear + fold
    r.x += r.y * (0.10 + 0.08 * sin(phase));
    float fold = abs(r.y + spread * 0.48 + 0.22 * sin(r.x * 1.52 + phase + t));
    float width = 0.010 + 0.004 * sin(phase * 1.7);
    float band = width / (fold * fold + width * 0.65);

    float envelope = exp(-abs(spread) * 1.75);
    float pulse = 0.72 + 0.28 * sin(phase * 2.0 + t * 0.9);
    float layer = band * envelope * pulse * 0.00115;

    vec3 c = palette(phase + r.x * 0.35 + t * 0.18);
    accum += c * layer;
    glow += layer;
  }

  // Warm pointer bloom and soft vignette.
  float pointerBloom = exp(-dMouse * 3.0) * influence * 0.12;
  accum += vec3(0.95, 0.77, 0.48) * pointerBloom;

  float vignette = smoothstep(1.45, 0.32, length(p * vec2(0.78, 1.0)));
  accum *= 0.60 + 0.40 * vignette;

  // ACES-ish compression + gamma, plus tiny interleaved dither.
  accum = accum / (vec3(1.0) + accum);
  accum = pow(max(accum, vec3(0.0)), vec3(0.82));
  float dither = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715)))) / 255.0;
  accum += dither;

  float alpha = clamp((accum.r + accum.g + accum.b) * 0.17, 0.0, 0.48);
  outColor = vec4(accum, alpha);
}`

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('RibbonGlow shader error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export function RibbonGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
      powerPreference: 'high-performance',
    })
    if (!gl) return

    const vs = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    if (!vs || !fs) return

    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('RibbonGlow program error:', gl.getProgramInfoLog(program))
      return
    }

    const position = gl.getAttribLocation(program, 'a_position')
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    )

    const uResolution = gl.getUniformLocation(program, 'u_resolution')
    const uPointer = gl.getUniformLocation(program, 'u_pointer')
    const uVelocity = gl.getUniformLocation(program, 'u_velocity')
    const uTime = gl.getUniformLocation(program, 'u_time')
    const uPresence = gl.getUniformLocation(program, 'u_presence')
    const uReduced = gl.getUniformLocation(program, 'u_reduced')

    const pointer = { x: 0.62, y: 0.40 }
    const targetPointer = { ...pointer }
    const velocity = { x: 0, y: 0 }
    const targetVelocity = { x: 0, y: 0 }
    let presence = 0.32
    let targetPresence = 0.32
    let lastX = pointer.x
    let lastY = pointer.y
    let raf = 0
    const start = performance.now()
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')

    const resize = () => {
      // Quarter-pixel cost: half-resolution field, CSS upsamples bilinearly.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25)
      const scale = window.innerWidth < 768 ? 0.42 : 0.52
      canvas.width = Math.max(1, Math.floor(window.innerWidth * dpr * scale))
      canvas.height = Math.max(1, Math.floor(window.innerHeight * dpr * scale))
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    const onPointerMove = (event: PointerEvent) => {
      const nx = event.clientX / Math.max(window.innerWidth, 1)
      const ny = 1 - event.clientY / Math.max(window.innerHeight, 1)
      targetVelocity.x = (nx - lastX) * 18
      targetVelocity.y = (ny - lastY) * 18
      targetPointer.x = nx
      targetPointer.y = ny
      lastX = nx
      lastY = ny
      targetPresence = 1
    }
    const onPointerLeave = () => { targetPresence = 0.25 }

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onPointerLeave)
    resize()

    const render = (now: number) => {
      const reduced = media.matches ? 1 : 0
      pointer.x += (targetPointer.x - pointer.x) * 0.055
      pointer.y += (targetPointer.y - pointer.y) * 0.055
      velocity.x += (targetVelocity.x - velocity.x) * 0.08
      velocity.y += (targetVelocity.y - velocity.y) * 0.08
      targetVelocity.x *= 0.90
      targetVelocity.y *= 0.90
      presence += (targetPresence - presence) * 0.035

      gl.useProgram(program)
      gl.enableVertexAttribArray(position)
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
      gl.uniform2f(uResolution, canvas.width, canvas.height)
      gl.uniform2f(uPointer, pointer.x, pointer.y)
      gl.uniform2f(uVelocity, velocity.x, velocity.y)
      gl.uniform1f(uTime, (now - start) / 1000)
      gl.uniform1f(uPresence, presence)
      gl.uniform1f(uReduced, reduced)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      if (buffer) gl.deleteBuffer(buffer)
    }
  }, [])

  return (
    <>
      <div aria-hidden="true" className="ribbon-glow-fallback pointer-events-none fixed inset-0 z-[29]" />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="ribbon-glow pointer-events-none fixed inset-0 z-[30] h-[100dvh] w-screen"
      />
    </>
  )
}
