import {
  Object3D,
  Color,
  Mesh,
  DoubleSide,
  AdditiveBlending,
  ShaderMaterial,
  PlaneGeometry,
  Vector2,
  MeshBasicMaterial,
  SRGBColorSpace,
  RepeatWrapping,
} from "three"

export class RippleShader extends Object3D {
  constructor(self, config) {
    super()
    this.assets = self.assets
    this.config = Object.assign(
      {
        size: 10,
        color: 0x00ffff,
        renderOrder: 99,
      },
      config
    )
    this.material = null
    this.init()
  }
  init() {
    // 尺寸
    const { size, color } = this.config
    const geometry = new PlaneGeometry(size, size, 1)
    const material = new ShaderMaterial({
      vertexShader: /*glsl*/ `
        varying vec2 vUv;
        void main() {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectionPosition = projectionMatrix * viewPosition;
            gl_Position = projectionPosition;
            vUv = uv;

        }
      `,
      fragmentShader: /*glsl*/ `
        uniform vec3 iResolution;           // viewport resolution (in pixels)
        uniform float iTime;                 // shader playback time (in seconds)
        varying vec2 vUv;
        uniform vec3 iColor;
        uniform float iAlpha;

        // returns a vec3 color from every pixel requested.
        // Generates a BnW Ping on normalized 2d coordinate system
        vec3 RadarPing(
            in vec2 uv,
            in vec2 center,
            in float innerTail,
            in float frontierBorder,
            in float timeResetSeconds,
            in float radarPingSpeed,
            in float fadeDistance,
            float t
        ) {
            vec2 diff = center - uv;
            float r = length(diff);
            float time = mod(t, timeResetSeconds) * radarPingSpeed;

            float circle;
            // r is the distance to the center.
            // circle = BipCenter---//---innerTail---time---frontierBorder
            //illustration
            //https://sketch.io/render/sk-14b54f90080084bad1602f81cadd4d07.jpeg
            circle += smoothstep(time - innerTail, time, r) * smoothstep(time + frontierBorder, time, r);
            circle *= smoothstep(fadeDistance, 0.0, r); // fade to 0 after fadeDistance

            return vec3(circle);
        }

        void main() {

            //normalize coordinates 
            vec2 uv = vUv; //move coordinates to 0..1
            uv = uv.xy * 2.; // translate to the center
            uv += vec2(-1.0, -1.0);
            // uv.x *= iResolution.x / iResolution.y; //correct the aspect ratio

            vec3 color;
            // generate some radar pings
            float fadeDistance = 0.6;
            float resetTimeSec = 3.0;
            float radarPingSpeed = 0.2;
            vec2 greenPing = vec2(0.0, 0.0);
            color += RadarPing(uv, greenPing, 0.08, 0.00025, resetTimeSec, radarPingSpeed, fadeDistance, iTime) * iColor;
            color += RadarPing(uv, greenPing, 0.08, 0.00025, resetTimeSec, radarPingSpeed, fadeDistance, iTime + 1.) * iColor;
            color += RadarPing(uv, greenPing, 0.08, 0.00025, resetTimeSec, radarPingSpeed, fadeDistance, iTime + 2.) * iColor;
            //return the new color
            gl_FragColor = vec4(color, iAlpha);
        }
      `,
      side: DoubleSide,
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
      uniforms: {
        iResolution: {
          value: new Vector2(size, size),
        },
        iTime: {
          value: 0.0,
        },
        iAlpha: {
          value: 1.0,
        },
        iColor: {
          value: new Color(color),
        },
      },
    })
    this.material = material
    let plane = new Mesh(geometry, material)
    plane.rotateX(-Math.PI / 2)
    this.add(plane)
    this.createMidPoint()
  }
  // 创建中间点
  createMidPoint() {
    const { size, color } = this.config
    const geometry = new PlaneGeometry(size, size, 1)
    let texture = this.assets.instance.getResource("particle")
    texture.colorSpace = SRGBColorSpace
    texture.wrapS = texture.wrapT = RepeatWrapping
    let material = new MeshBasicMaterial({
      map: texture,
      alphaMap: texture,
      color,
      transparent: true,
      opacity: 1,
      blending: AdditiveBlending,
      depthWrite: false,
    })
    let plane = new Mesh(geometry, material)
    plane.rotateX(-Math.PI / 2)
    this.add(plane)
  }
  update(delta) {
    if (this.material) {
      this.material.uniforms.iTime.value += delta
    }
  }
}
