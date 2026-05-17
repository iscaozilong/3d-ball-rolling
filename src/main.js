import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

console.log('=== 3D Ball Game Loading ===')

const canvas = document.getElementById('canvas')

const UI = {
  container: null,
  helpButton: null,
  helpPanel: null,
  fps: 0,
  frameCount: 0,
  lastFpsUpdate: Date.now(),
  
  init() {
    this.container = document.createElement('div')
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 15px 20px;
      border-radius: 10px;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      z-index: 100;
      backdrop-filter: blur(5px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    `
    document.body.appendChild(this.container)
    
    this.helpButton = document.createElement('button')
    this.helpButton.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      border: none;
      border-radius: 50%;
      font-size: 20px;
      cursor: pointer;
      z-index: 100;
      backdrop-filter: blur(5px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.3s ease;
    `
    this.helpButton.innerHTML = '?'
    document.body.appendChild(this.helpButton)
    
    this.helpPanel = document.createElement('div')
    this.helpPanel.style.cssText = `
      position: fixed;
      top: 70px;
      right: 20px;
      background: rgba(0, 0, 0, 0.85);
      color: white;
      padding: 20px;
      border-radius: 10px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      z-index: 99;
      backdrop-filter: blur(5px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: none;
      max-width: 300px;
    `
    this.helpPanel.innerHTML = `
      <h3 style="margin-bottom: 15px; color: #4fc3f7;">操作指南</h3>
      <div style="margin-bottom: 10px;">
        <strong>键盘控制:</strong><br>
        WASD / 方向键 - 控制小球移动<br>
        空格键 - 暂停/继续<br>
        鼠标拖拽 - 旋转视角<br>
        滚轮 - 缩放视角
      </div>
      <div style="margin-bottom: 10px;">
        <strong>触摸控制:</strong><br>
        滑动屏幕 - 给小球施加力
      </div>
      <div>
        <strong>游戏内容:</strong><br>
        与场景中的彩色小球碰撞<br>
        高速移动产生火花效果<br>
        每滚动10米触发随机事件
      </div>
    `
    document.body.appendChild(this.helpPanel)
    
    this.helpButton.onclick = () => {
      this.helpPanel.style.display = 
        this.helpPanel.style.display === 'none' ? 'block' : 'none'
      this.helpButton.innerHTML = this.helpPanel.style.display === 'none' ? '?' : '×'
    }
  },
  
  update(speed, distance) {
    this.frameCount++
    const now = Date.now()
    if (now - this.lastFpsUpdate >= 1000) {
      this.fps = this.frameCount
      this.frameCount = 0
      this.lastFpsUpdate = now
    }
    
    this.container.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="color: #4fc3f7;">速度:</span>
        <span>${speed.toFixed(1)} m/s</span>
      </div>
      <div style="display: flex; align-items: center; gap: 8px; margin-top: 5px;">
        <span style="color: #66bb6a;">距离:</span>
        <span>${distance.toFixed(0)} m</span>
      </div>
      <div style="display: flex; align-items: center; gap: 8px; margin-top: 5px;">
        <span style="color: #ffeb3b;">FPS:</span>
        <span>${this.fps}</span>
      </div>
    `
  }
}

UI.init()

UI.showPause = function() {
  if (!this.pauseOverlay) {
    this.pauseOverlay = document.createElement('div')
    this.pauseOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 200;
    `
    this.pauseOverlay.innerHTML = `
      <div style="
        color: white;
        font-size: 48px;
        font-family: 'Courier New', monospace;
        text-align: center;
      ">
        <div style="margin-bottom: 20px;">已暂停</div>
        <div style="font-size: 20px; color: #aaa;">按空格键继续</div>
      </div>
    `
    document.body.appendChild(this.pauseOverlay)
  }
  this.pauseOverlay.style.display = 'flex'
}

UI.hidePause = function() {
  if (this.pauseOverlay) {
    this.pauseOverlay.style.display = 'none'
  }
}

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x1a1a2e)

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(15, 10, 15)

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.target.set(0, 2, 0)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
directionalLight.position.set(20, 40, 20)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 2048
directionalLight.shadow.mapSize.height = 2048
directionalLight.shadow.camera.near = 0.5
directionalLight.shadow.camera.far = 200
directionalLight.shadow.camera.left = -100
directionalLight.shadow.camera.right = 100
directionalLight.shadow.camera.top = 100
directionalLight.shadow.camera.bottom = -100
scene.add(directionalLight)

const pointLight = new THREE.PointLight(0x4fc3f7, 0.8, 100)
pointLight.position.set(-20, 20, -20)
scene.add(pointLight)

const groundGeometry = new THREE.PlaneGeometry(60, 60, 50, 50)
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x2d3436,
  roughness: 0.8,
  metalness: 0.2
})
const ground = new THREE.Mesh(groundGeometry, groundMaterial)
ground.rotation.x = -Math.PI / 2
ground.receiveShadow = true
scene.add(ground)

const wallThickness = 1
const wallHeight = 5
const wallSize = 60
const wallMaterial = new THREE.MeshStandardMaterial({
  color: 0x636e72,
  roughness: 0.7,
  metalness: 0.3
})

const walls = [
  [0, wallHeight / 2, -wallSize / 2 - wallThickness / 2, wallSize, wallHeight, wallThickness],
  [0, wallHeight / 2, wallSize / 2 + wallThickness / 2, wallSize, wallHeight, wallThickness],
  [-wallSize / 2 - wallThickness / 2, wallHeight / 2, 0, wallThickness, wallHeight, wallSize],
  [wallSize / 2 + wallThickness / 2, wallHeight / 2, 0, wallThickness, wallHeight, wallSize]
]

const wallMeshes = walls.map(pos => {
  const geo = new THREE.BoxGeometry(pos[3], pos[4], pos[5])
  const mesh = new THREE.Mesh(geo, wallMaterial)
  mesh.position.set(pos[0], pos[1], pos[2])
  mesh.castShadow = true
  mesh.receiveShadow = true
  scene.add(mesh)
  return mesh
})

const ballGeometry = new THREE.SphereGeometry(1, 64, 64)

const ballVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vEyeNormal;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vEyeNormal = normalize(normal);
    vPosition = position;
    vUv = uv;
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const ballFragmentShader = `
  uniform float uSpeed;
  uniform float uTime;
  uniform vec3 uLightPos;
  uniform vec3 uCameraPos;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vEyeNormal;
  
  void main() {
    vec3 normal = normalize(vNormal);
    vec3 worldNormal = normalize(vEyeNormal);
    
    vec3 lightDir = normalize(uLightPos - vWorldPosition);
    vec3 viewDir = normalize(uCameraPos - vWorldPosition);
    vec3 reflectDir = reflect(-lightDir, worldNormal);
    
    float speedFactor = clamp(uSpeed * 0.08, 0.0, 1.0);
    
    vec3 baseColor = mix(
      vec3(0.25, 0.65, 0.85),
      vec3(0.9, 0.4, 0.2),
      speedFactor
    );
    
    float stripeDensity = 12.0 + uSpeed * 1.5;
    float stripeSpeed = uSpeed * 3.0;
    float stripeAngle = 0.785;
    
    vec2 rotatedUv = vec2(
      vUv.x * cos(stripeAngle) - vUv.y * sin(stripeAngle),
      vUv.x * sin(stripeAngle) + vUv.y * cos(stripeAngle)
    );
    
    float stripePattern = mod(rotatedUv.x * stripeDensity + uTime * stripeSpeed, 1.0);
    stripePattern = smoothstep(0.45, 0.55, stripePattern);
    
    vec3 stripeColor = mix(
      vec3(0.95, 0.95, 1.0),
      vec3(0.7, 0.85, 1.0),
      speedFactor * 0.5
    );
    
    vec3 albedo = mix(baseColor, stripeColor, stripePattern * 0.4);
    
    float ambient = 0.35;
    float diffuse = max(0.0, dot(worldNormal, lightDir)) * 0.8;
    
    float shininess = 32.0 + uSpeed * 8.0;
    float specular = pow(max(0.0, dot(reflectDir, viewDir)), shininess) * 0.5;
    
    float rim = pow(1.0 - max(0.0, dot(worldNormal, viewDir)), 4.0);
    float rimIntensity = 0.3 + speedFactor * 0.4;
    rim *= rimIntensity;
    
    float glow = speedFactor * 0.15;
    
    vec3 lighting = vec3(ambient + diffuse) * albedo;
    lighting += vec3(specular);
    lighting += vec3(rim * 0.8);
    lighting += albedo * glow;
    
    gl_FragColor = vec4(lighting, 1.0);
  }
`

const ballMaterial = new THREE.ShaderMaterial({
  vertexShader: ballVertexShader,
  fragmentShader: ballFragmentShader,
  uniforms: {
    uSpeed: { value: 0 },
    uTime: { value: 0 },
    uLightPos: { value: new THREE.Vector3(20, 40, 20) },
    uCameraPos: { value: new THREE.Vector3(15, 10, 15) }
  },
  transparent: false,
  side: THREE.FrontSide
})

const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial)
ballMesh.castShadow = true
ballMesh.receiveShadow = true
scene.add(ballMesh)

const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)
world.broadphase = new CANNON.NaiveBroadphase()
world.solver.iterations = 10

const physicsMaterials = {
  ground: new CANNON.Material('ground'),
  wall: new CANNON.Material('wall'),
  ball: new CANNON.Material('ball')
}

world.addContactMaterial(
  new CANNON.ContactMaterial(physicsMaterials.ball, physicsMaterials.ground, {
    friction: 0.7,
    restitution: 0.2
  })
)

world.addContactMaterial(
  new CANNON.ContactMaterial(physicsMaterials.ball, physicsMaterials.wall, {
    friction: 0.5,
    restitution: 0.5
  })
)

world.addContactMaterial(
  new CANNON.ContactMaterial(physicsMaterials.ball, physicsMaterials.ball, {
    friction: 0.6,
    restitution: 0.4
  })
)

let staticBalls = []
const staticBallColors = [0xff5722, 0x4caf50, 0xffeb3b, 0x9c27b0, 0x00bcd4, 0xe91e63]

function createStaticBall(x, z, radius) {
  const geometry = new THREE.SphereGeometry(radius, 32, 32)
  const color = staticBallColors[Math.floor(Math.random() * staticBallColors.length)]
  const material = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.4,
    metalness: 0.6,
    emissive: color,
    emissiveIntensity: 0.1
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(x, radius, z)
  mesh.castShadow = true
  mesh.receiveShadow = true
  scene.add(mesh)

  const body = new CANNON.Body({
    mass: 8,
    shape: new CANNON.Sphere(radius),
    material: physicsMaterials.ball,
    linearDamping: 0.5,
    angularDamping: 0.5
  })
  body.position.set(x, radius, z)
  body.velocity.set(0, 0, 0)
  world.addBody(body)

  staticBalls.push({ mesh, body })
}

for (let i = 0; i < 8; i++) {
  const x = (Math.random() - 0.5) * 40
  const z = (Math.random() - 0.5) * 40
  const radius = 0.8 + Math.random() * 1.2
  const dx = x - 0
  const dz = z - 0
  if (Math.sqrt(dx * dx + dz * dz) > 5) {
    createStaticBall(x, z, radius)
  } else {
    i--
  }
}

const groundBody = new CANNON.Body({
  mass: 0,
  shape: new CANNON.Plane(),
  material: physicsMaterials.ground
})
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
world.addBody(groundBody)

const wallBodies = walls.map(pos => {
  const body = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Box(new CANNON.Vec3(pos[3]/2, pos[4]/2, pos[5]/2)),
    material: physicsMaterials.wall
  })
  body.position.set(pos[0], pos[1], pos[2])
  world.addBody(body)
  return body
})

const ballBody = new CANNON.Body({
  mass: 5,
  shape: new CANNON.Sphere(1),
  material: physicsMaterials.ball,
  linearDamping: 0.1,
  angularDamping: 0.1
})
ballBody.position.set(0, 5, 0)
world.addBody(ballBody)

let totalDistance = 0
let lastBallPos = new THREE.Vector3(0, 5, 0)
let keys = {}

window.addEventListener('keydown', e => {
  keys[e.code] = true
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
    e.preventDefault()
  }
  if (e.code === 'Space') {
    isPaused = !isPaused
    if (isPaused) {
      UI.showPause()
    } else {
      UI.hidePause()
      clock.getDelta()
    }
  }
})

let isPaused = false

window.addEventListener('keyup', e => {
  keys[e.code] = false
})

let particles = []
let particlePool = []

class Particle {
  constructor() {
    this.geometry = new THREE.SphereGeometry(0.05, 8, 8)
    this.material = new THREE.MeshStandardMaterial({
      emissive: 0xff9800,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 1
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.visible = false
    this.velocity = new THREE.Vector3()
    this.life = 0
    this.maxLife = 0
  }
  
  spawn(pos, vel, color = 0xff9800) {
    this.mesh.position.copy(pos)
    this.velocity.copy(vel)
    this.life = 1
    this.maxLife = 1
    this.mesh.visible = true
    this.material.emissive.setHex(color)
    scene.add(this.mesh)
  }
  
  update(dt) {
    if (!this.mesh.visible) return
    
    this.life -= dt
    if (this.life <= 0) {
      this.mesh.visible = false
      if (scene.children.includes(this.mesh)) {
        scene.remove(this.mesh)
      }
      return
    }
    
    this.velocity.y -= 9.8 * dt
    this.mesh.position.add(this.velocity.clone().multiplyScalar(dt))
    this.material.opacity = this.life / this.maxLife
    
    const scale = 0.5 + (this.life / this.maxLife) * 0.5
    this.mesh.scale.setScalar(scale)
  }
}

for (let i = 0; i < 150; i++) {
  particlePool.push(new Particle())
}

function getParticle() {
  return particlePool.find(p => !p.mesh.visible)
}

const clock = new THREE.Clock()
let lastTimeEvent = Date.now()
let shaderTime = 0

function animate() {
  requestAnimationFrame(animate)
  
  if (isPaused) {
    return
  }
  
  const dt = Math.min(clock.getDelta(), 0.1)
  shaderTime += dt
  world.step(1/60, dt, 3)
  
  ballMesh.position.set(ballBody.position.x, ballBody.position.y, ballBody.position.z)
  ballMesh.quaternion.set(
    ballBody.quaternion.x,
    ballBody.quaternion.y,
    ballBody.quaternion.z,
    ballBody.quaternion.w
  )
  
  staticBalls.forEach(sb => {
    sb.mesh.position.set(sb.body.position.x, sb.body.position.y, sb.body.position.z)
  })
  
  const speed = ballBody.velocity.length()
  ballMaterial.uniforms.uSpeed.value = speed
  ballMaterial.uniforms.uTime.value = shaderTime
  ballMaterial.uniforms.uCameraPos.value.copy(camera.position)
  
  const currPos = new THREE.Vector3(
    ballBody.position.x,
    ballBody.position.y,
    ballBody.position.z
  )
  totalDistance += currPos.distanceTo(lastBallPos)
  lastBallPos.copy(currPos)
  
  const force = 200
  const cameraDir = new THREE.Vector3()
  camera.getWorldDirection(cameraDir)
  cameraDir.y = 0
  cameraDir.normalize()
  const cameraRight = new THREE.Vector3(-cameraDir.z, 0, cameraDir.x)
  
  let moveDir = new THREE.Vector3()
  if (keys['KeyW'] || keys['ArrowUp']) moveDir.add(cameraDir)
  if (keys['KeyS'] || keys['ArrowDown']) moveDir.sub(cameraDir)
  if (keys['KeyA'] || keys['ArrowLeft']) moveDir.sub(cameraRight)
  if (keys['KeyD'] || keys['ArrowRight']) moveDir.add(cameraRight)
  
  if (moveDir.lengthSq() > 0) {
    moveDir.normalize().multiplyScalar(force)
    ballBody.applyForce(
      new CANNON.Vec3(moveDir.x, 0, moveDir.z)
    )
  }
  
  if (speed > 5 && Math.random() < 0.3) {
    const colors = [0xff9800, 0xff5722, 0xffeb3b, 0xffffff, 0x4fc3f7]
    for (let i = 0; i < 3; i++) {
      const p = getParticle()
      if (p) {
        const pos = currPos.clone().add(
          new THREE.Vector3(
            (Math.random() - 0.5) * 0.5,
            0.1 + Math.random() * 0.3,
            (Math.random() - 0.5) * 0.5
          )
        )
        const vel = new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          Math.random() * 1.5 + 0.5,
          (Math.random() - 0.5) * 2
        )
        p.spawn(pos, vel, colors[Math.floor(Math.random() * colors.length)])
      }
    }
  }
  
  particlePool.forEach(p => p.update(dt))
  
  const now = Date.now()
  if (now - lastTimeEvent > 2000) {
    lastTimeEvent = now
    const types = ['flower', 'grass']
    const type = types[Math.floor(Math.random() * types.length)]
    const x = (Math.random() - 0.5) * 40
    const z = (Math.random() - 0.5) * 40
    
    if (type === 'flower') {
      const stemGeo = new THREE.CylinderGeometry(0.05, 0.08, 1.5, 8)
      const stemMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32 })
      const stem = new THREE.Mesh(stemGeo, stemMat)
      const flowerGeo = new THREE.SphereGeometry(0.3, 16, 16)
      const flowerMat = new THREE.MeshStandardMaterial({
        color: Math.random() > 0.5 ? 0xe91e63 : 0xff5722,
        emissive: 0xffffff,
        emissiveIntensity: 0.2
      })
      const flower = new THREE.Mesh(flowerGeo, flowerMat)
      flower.position.y = 0.85
      const group = new THREE.Group()
      group.add(stem)
      group.add(flower)
      group.position.set(x, 0, z)
      scene.add(group)
    } else {
      const geo = new THREE.ConeGeometry(0.3, 0.8, 8)
      const mat = new THREE.MeshStandardMaterial({ color: 0x66bb6a })
      const grass = new THREE.Mesh(geo, mat)
      grass.rotation.x = Math.PI
      grass.position.set(x, 0.4, z)
      scene.add(grass)
    }
  }
  
  const target = currPos.clone().add(new THREE.Vector3(0, 1.5, 0))
  const desiredCameraPos = target.clone().add(new THREE.Vector3(12, 8, 12))
  camera.position.lerp(desiredCameraPos, 0.05)
  controls.target.copy(target)
  
  controls.update()
  UI.update(speed, totalDistance)
  renderer.render(scene, camera)
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

animate()
console.log('=== Game Loaded ===')
