import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

interface HeroScene3DProps {
  onBasketBounce?: (bounceCount: number) => void;
}

const _pointer = new THREE.Vector2(0, 0);
const _raycaster = new THREE.Raycaster();
const _worldCursor = new THREE.Vector3();
const _deltaVec = new THREE.Vector3();

function createWeaveTexture(maxAniso: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#183D2C';
  ctx.fillRect(0, 0, 256, 256);

  const cell = 32;
  for (let y = 0; y < 256; y += cell) {
    for (let x = 0; x < 256; x += cell) {
      const even = ((x / cell) + (y / cell)) % 2 === 0;
      ctx.fillStyle = even ? '#214F3A' : '#133123';
      ctx.fillRect(x + 2, y + 2, cell - 4, cell - 4);
      ctx.fillStyle = even ? 'rgba(155, 230, 60, 0.08)' : 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(x + 4, y + 4, cell - 8, 5);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 3);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAniso;
  return tex;
}

function createCitrusTexture(baseHex: string, dimpleHex: string, maxAniso: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 128, 128);
  ctx.fillStyle = dimpleHex;
  for (let i = 0; i < 240; i++) {
    const px = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    const py = (Math.cos(i * 78.233) * 19341.212) % 1;
    const x = Math.abs(px) * 128;
    const y = Math.abs(py) * 128;
    ctx.beginPath();
    ctx.arc(x, y, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAniso;
  return tex;
}

function createMangoTexture(maxAniso: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createLinearGradient(0, 0, 0, 128);
  grad.addColorStop(0, '#E85D04');
  grad.addColorStop(0.45, '#F59E0B');
  grad.addColorStop(0.85, '#FACC15');
  grad.addColorStop(1, '#84CC16');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAniso;
  return tex;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 122);
  grad.addColorStop(0, 'rgba(16, 43, 31, 0.34)');
  grad.addColorStop(0.55, 'rgba(16, 43, 31, 0.14)');
  grad.addColorStop(1, 'rgba(16, 43, 31, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildLeafMesh(colorHex: number, scale = 1): THREE.Mesh {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(0.18, 0.22, 0, 0.52);
  shape.quadraticCurveTo(-0.18, 0.22, 0, 0);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.025,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelSegments: 2,
  });
  geo.center();
  const mat = new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness: 0.42,
    metalness: 0.04,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.scale.setScalar(scale);
  return mesh;
}

function buildStrawberryGroup(seedTex: THREE.CanvasTexture): THREE.Group {
  const g = new THREE.Group();
  const pts = [
    new THREE.Vector2(0.0, -0.28),
    new THREE.Vector2(0.12, -0.2),
    new THREE.Vector2(0.22, -0.02),
    new THREE.Vector2(0.24, 0.12),
    new THREE.Vector2(0.15, 0.22),
    new THREE.Vector2(0.0, 0.24),
  ];
  const bodyGeo = new THREE.LatheGeometry(pts, 20);
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: 0xdc2626,
    map: seedTex,
    roughness: 0.32,
    clearcoat: 0.35,
    clearcoatRoughness: 0.28,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.castShadow = true;
  g.add(body);

  for (let i = 0; i < 5; i++) {
    const leaf = buildLeafMesh(0x3f8f29, 0.34);
    leaf.position.set(0, 0.24, 0);
    leaf.rotation.set(Math.PI / 2.2, (i * Math.PI * 2) / 5, 0);
    g.add(leaf);
  }
  return g;
}

function buildMangoGroup(mangoTex: THREE.CanvasTexture): THREE.Group {
  const g = new THREE.Group();
  const pts = [
    new THREE.Vector2(0.0, -0.34),
    new THREE.Vector2(0.18, -0.28),
    new THREE.Vector2(0.27, -0.05),
    new THREE.Vector2(0.25, 0.16),
    new THREE.Vector2(0.14, 0.32),
    new THREE.Vector2(0.0, 0.36),
  ];
  const geo = new THREE.LatheGeometry(pts, 24);
  geo.scale(1.0, 1.15, 0.88);
  const mat = new THREE.MeshPhysicalMaterial({
    map: mangoTex,
    roughness: 0.3,
    clearcoat: 0.4,
    clearcoatRoughness: 0.22,
  });
  const body = new THREE.Mesh(geo, mat);
  body.castShadow = true;
  g.add(body);

  const stemGeo = new THREE.CylinderGeometry(0.02, 0.03, 0.09, 8);
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x3b2f1e, roughness: 0.85 });
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.position.set(0, 0.42, 0);
  g.add(stem);

  return g;
}

function buildOrangeGroup(orangeTex: THREE.CanvasTexture): THREE.Group {
  const g = new THREE.Group();
  const geo = new THREE.SphereGeometry(0.28, 24, 20);
  const mat = new THREE.MeshStandardMaterial({
    map: orangeTex,
    roughness: 0.48,
    metalness: 0.02,
  });
  const fruit = new THREE.Mesh(geo, mat);
  fruit.castShadow = true;
  g.add(fruit);

  const leaf = buildLeafMesh(0x2f7a32, 0.45);
  leaf.position.set(0.08, 0.29, 0.02);
  leaf.rotation.set(0.6, 0.3, -0.5);
  g.add(leaf);
  return g;
}

function buildTomatoGroup(): THREE.Group {
  const g = new THREE.Group();
  const geo = new THREE.SphereGeometry(0.24, 24, 18);
  geo.scale(1.08, 0.86, 1.08);
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xd9261c,
    roughness: 0.18,
    clearcoat: 0.65,
    clearcoatRoughness: 0.15,
  });
  const body = new THREE.Mesh(geo, mat);
  body.castShadow = true;
  g.add(body);

  for (let i = 0; i < 5; i++) {
    const sepal = buildLeafMesh(0x1f6b2a, 0.28);
    sepal.position.set(0, 0.2, 0);
    sepal.rotation.set(Math.PI / 2.1, (i * Math.PI * 2) / 5, 0);
    g.add(sepal);
  }
  return g;
}

function buildBananaMesh(): THREE.Group {
  const g = new THREE.Group();
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.34, -0.05, 0),
    new THREE.Vector3(-0.12, 0.16, 0),
    new THREE.Vector3(0.14, 0.16, 0),
    new THREE.Vector3(0.34, -0.08, 0),
  ]);
  const geo = new THREE.TubeGeometry(curve, 20, 0.085, 12, false);
  const mat = new THREE.MeshStandardMaterial({
    color: 0xf4cf3e,
    roughness: 0.5,
    metalness: 0.02,
  });
  const banana = new THREE.Mesh(geo, mat);
  banana.castShadow = true;
  g.add(banana);

  const tipGeo = new THREE.CylinderGeometry(0.025, 0.05, 0.08, 8);
  const tipMat = new THREE.MeshStandardMaterial({ color: 0x4b3621, roughness: 0.9 });
  const tip = new THREE.Mesh(tipGeo, tipMat);
  tip.position.set(0.35, -0.1, 0);
  tip.rotation.z = -0.8;
  g.add(tip);
  return g;
}

export function HeroScene3D({ onBasketBounce }: HeroScene3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const bounceCallbackRef = useRef(onBasketBounce);
  bounceCallbackRef.current = onBasketBounce;
  const [fallbackActive, setFallbackActive] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const probeCanvas = document.createElement('canvas');
    const probeGl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
    if (!probeGl || prefersReduced) {
      setFallbackActive(true);
      return;
    }

    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setFallbackActive(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 560;
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.35, 6.6);
    camera.lookAt(0, 0.15, 0);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    // 3-point warm/cool studio lighting
    const hemiLight = new THREE.HemisphereLight(0xf2f9ff, 0x26422e, 0.9);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1d6, 2.2);
    keyLight.position.set(4.5, 6.5, 4.5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 20;
    const d = 3.5;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc2f27a, 1.15);
    rimLight.position.set(-4.2, 3.0, -3.5);
    scene.add(rimLight);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const weaveTex = createWeaveTexture(maxAniso);
    const orangeTex = createCitrusTexture('#F97316', '#C2410C', maxAniso);
    const seedTex = createCitrusTexture('#DC2626', '#FEF08A', maxAniso);
    const mangoTex = createMangoTexture(maxAniso);
    const shadowTex = createContactShadowTexture();

    // Ground contact shadow plane
    const contactShadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.72,
    });
    const contactShadow = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 2.8), contactShadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.set(0, -1.42, 0);
    scene.add(contactShadow);

    // Main 3D Grocery Basket Group (Composite multi-part model)
    const basketRoot = new THREE.Group();
    scene.add(basketRoot);

    const basketHullPts = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.86, 0.0),
      new THREE.Vector2(0.92, 0.08),
      new THREE.Vector2(1.08, 0.55),
      new THREE.Vector2(1.22, 1.05),
      new THREE.Vector2(1.16, 1.08),
      new THREE.Vector2(1.02, 0.55),
      new THREE.Vector2(0.84, 0.1),
      new THREE.Vector2(0.0, 0.1),
    ];
    const hullGeo = new THREE.LatheGeometry(basketHullPts, 36);
    hullGeo.scale(1.18, 1.0, 0.88);
    const hullMat = new THREE.MeshStandardMaterial({
      map: weaveTex,
      roughness: 0.78,
      metalness: 0.05,
    });
    const basketHull = new THREE.Mesh(hullGeo, hullMat);
    basketHull.position.y = -0.85;
    basketHull.castShadow = true;
    basketHull.receiveShadow = true;
    basketRoot.add(basketHull);

    // Natural warm rattan rim collar
    const rimGeo = new THREE.TorusGeometry(1.19, 0.075, 16, 44);
    rimGeo.rotateX(Math.PI / 2);
    rimGeo.scale(1.18, 1.0, 0.88);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xd6b078,
      roughness: 0.55,
      metalness: 0.04,
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.position.y = 0.21;
    rimMesh.castShadow = true;
    basketRoot.add(rimMesh);

    // Base oak trim ring
    const baseTrimGeo = new THREE.TorusGeometry(0.87, 0.045, 12, 36);
    baseTrimGeo.rotateX(Math.PI / 2);
    baseTrimGeo.scale(1.18, 1.0, 0.88);
    const baseTrim = new THREE.Mesh(baseTrimGeo, rimMat);
    baseTrim.position.y = -0.82;
    basketRoot.add(baseTrim);

    // Brushed brass handles + grip
    const handleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.35, 0.22, 0),
      new THREE.Vector3(-1.12, 0.98, 0.12),
      new THREE.Vector3(0, 1.24, 0.14),
      new THREE.Vector3(1.12, 0.98, 0.12),
      new THREE.Vector3(1.35, 0.22, 0),
    ]);
    const handleGeo = new THREE.TubeGeometry(handleCurve, 32, 0.042, 12, false);
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.22,
      metalness: 0.88,
    });
    const handleMesh = new THREE.Mesh(handleGeo, brassMat);
    handleMesh.castShadow = true;
    basketRoot.add(handleMesh);

    // Leather-wrapped center handle grip
    const gripCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.35, 1.2, 0.14),
      new THREE.Vector3(0, 1.24, 0.14),
      new THREE.Vector3(0.35, 1.2, 0.14),
    ]);
    const gripGeo = new THREE.TubeGeometry(gripCurve, 12, 0.06, 12, false);
    const gripMat = new THREE.MeshStandardMaterial({ color: 0x7c4a2d, roughness: 0.68 });
    const gripMesh = new THREE.Mesh(gripGeo, gripMat);
    basketRoot.add(gripMesh);

    // Brass rivet caps on rim
    const rivetGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.1, 14);
    [-1.35, 1.35].forEach((rx) => {
      const rivet = new THREE.Mesh(rivetGeo, brassMat);
      rivet.position.set(rx, 0.22, 0);
      basketRoot.add(rivet);
    });

    // Fresh Produce nestled inside the basket
    const produceInside = new THREE.Group();
    basketRoot.add(produceInside);

    // Artisanal sourdough dome loaf
    const breadGeo = new THREE.SphereGeometry(0.45, 22, 16);
    breadGeo.scale(1.25, 0.72, 0.92);
    const breadMat = new THREE.MeshStandardMaterial({ color: 0xc6823c, roughness: 0.88 });
    const bread = new THREE.Mesh(breadGeo, breadMat);
    bread.position.set(-0.48, 0.22, -0.22);
    bread.rotation.set(0.15, 0.4, 0.2);
    bread.castShadow = true;
    produceInside.add(bread);

    // Alphonso Mangoes inside basket
    const m1 = buildMangoGroup(mangoTex);
    m1.position.set(0.42, 0.24, 0.12);
    m1.rotation.set(0.3, 0.5, -0.45);
    m1.scale.setScalar(1.05);
    produceInside.add(m1);

    const m2 = buildMangoGroup(mangoTex);
    m2.position.set(0.05, 0.34, -0.24);
    m2.rotation.set(-0.2, -0.4, 0.55);
    m2.scale.setScalar(0.95);
    produceInside.add(m2);

    // Oranges inside basket
    const o1 = buildOrangeGroup(orangeTex);
    o1.position.set(-0.55, 0.32, 0.28);
    o1.scale.setScalar(1.06);
    produceInside.add(o1);

    const o2 = buildOrangeGroup(orangeTex);
    o2.position.set(0.68, 0.22, -0.18);
    o2.scale.setScalar(0.92);
    produceInside.add(o2);

    // Vine Tomatoes inside basket
    const t1 = buildTomatoGroup();
    t1.position.set(-0.08, 0.34, 0.36);
    t1.scale.setScalar(1.08);
    produceInside.add(t1);

    const t2 = buildTomatoGroup();
    t2.position.set(0.28, 0.28, 0.44);
    t2.scale.setScalar(0.9);
    produceInside.add(t2);

    // Bananas peeking over the rim
    const b1 = buildBananaMesh();
    b1.position.set(-0.18, 0.45, -0.02);
    b1.rotation.set(0.2, 0.6, 0.35);
    b1.scale.setScalar(1.3);
    produceInside.add(b1);

    const b2 = buildBananaMesh();
    b2.position.set(-0.04, 0.49, 0.08);
    b2.rotation.set(0.32, 0.72, 0.28);
    b2.scale.setScalar(1.22);
    produceInside.add(b2);

    // Strawberries crowning the front
    [
      [-0.36, 0.46, 0.42, 0.9],
      [0.48, 0.44, 0.32, 0.85],
      [0.12, 0.48, 0.25, 0.82],
    ].forEach(([sx, sy, sz, sc]) => {
      const sb = buildStrawberryGroup(seedTex);
      sb.position.set(sx, sy, sz);
      sb.rotation.set(0.3, sx, -sz);
      sb.scale.setScalar(sc);
      produceInside.add(sb);
    });

    // Spinach & herb leaves tucked around rim
    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2;
      const leaf = buildLeafMesh(i % 2 === 0 ? 0x2c8a3e : 0x65a30d, 0.75);
      leaf.position.set(Math.cos(ang) * 0.96, 0.32, Math.sin(ang) * 0.72);
      leaf.rotation.set(0.55, -ang, 0.3);
      produceInside.add(leaf);
    }

    // Orbiting Floating Produce & Leaves around the Basket
    interface FloatingSatellite {
      mesh: THREE.Object3D;
      basePos: THREE.Vector3;
      phase: number;
      speed: number;
      rotSpeed: THREE.Vector3;
      repelOffset: THREE.Vector3;
      burstOffset: THREE.Vector3;
    }

    const satellites: FloatingSatellite[] = [];
    const satConfigs: Array<{ make: () => THREE.Object3D; pos: [number, number, number]; scale: number }> = [
      { make: () => buildStrawberryGroup(seedTex), pos: [-2.05, 0.85, 0.4], scale: 0.92 },
      { make: () => buildOrangeGroup(orangeTex), pos: [2.1, 0.65, 0.2], scale: 0.82 },
      { make: () => buildMangoGroup(mangoTex), pos: [-1.85, -0.55, 0.75], scale: 0.78 },
      { make: () => buildTomatoGroup(), pos: [1.95, -0.45, 0.85], scale: 0.84 },
      { make: () => buildStrawberryGroup(seedTex), pos: [1.45, 1.38, -0.25], scale: 0.78 },
      { make: () => buildBananaMesh(), pos: [-1.4, 1.42, -0.3], scale: 0.85 },
      { make: () => buildLeafMesh(0x84cc16, 0.8), pos: [-2.35, 0.15, -0.2], scale: 1.0 },
      { make: () => buildLeafMesh(0x228b22, 0.85), pos: [2.38, 0.1, -0.15], scale: 1.0 },
    ];

    satConfigs.forEach((cfg, idx) => {
      const m = cfg.make();
      m.position.set(...cfg.pos);
      m.scale.setScalar(cfg.scale);
      scene.add(m);
      satellites.push({
        mesh: m,
        basePos: new THREE.Vector3(...cfg.pos),
        phase: idx * 1.15,
        speed: 0.8 + (idx % 3) * 0.25,
        rotSpeed: new THREE.Vector3(0.35 + idx * 0.05, 0.55, 0.25),
        repelOffset: new THREE.Vector3(),
        burstOffset: new THREE.Vector3(),
      });
    });

    // Fresh Leaf / Zest Particle System (InstancedMesh for optimal draw calls)
    const particleCount = 26;
    const particleShape = new THREE.Shape();
    particleShape.moveTo(0, 0);
    particleShape.quadraticCurveTo(0.06, 0.09, 0, 0.18);
    particleShape.quadraticCurveTo(-0.06, 0.09, 0, 0);
    const particleGeo = new THREE.ShapeGeometry(particleShape);
    const particleMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.4,
      side: THREE.DoubleSide,
    });
    const particleMesh = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);
    particleMesh.frustumCulled = false;
    const particleData: Array<{ base: THREE.Vector3; speed: number; phase: number; scale: number }> = [];
    const dummy = new THREE.Object3D();
    const paletteColors = [
      new THREE.Color(0x9be63c),
      new THREE.Color(0xf4d03f),
      new THREE.Color(0x22c55e),
      new THREE.Color(0xf97316),
      new THREE.Color(0xef4444),
    ];
    for (let i = 0; i < particleCount; i++) {
      const ang = (i / particleCount) * Math.PI * 2;
      const rad = 1.65 + (i % 4) * 0.45;
      const py = ((i % 7) - 3) * 0.48;
      particleData.push({
        base: new THREE.Vector3(Math.cos(ang) * rad, py, Math.sin(ang) * (rad * 0.55)),
        speed: 0.4 + (i % 5) * 0.15,
        phase: i * 0.7,
        scale: 0.7 + (i % 3) * 0.35,
      });
      particleMesh.setColorAt(i, paletteColors[i % paletteColors.length]);
    }
    if (particleMesh.instanceColor) particleMesh.instanceColor.needsUpdate = true;
    scene.add(particleMesh);

    // Interactive state
    let targetRotX = 0.14;
    let targetRotY = -0.18;
    let bounceVelocity = 0;
    let bounceHeight = 0;
    let bounceSpin = 0;
    let clickCount = 0;
    let isPointerInside = false;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      _pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      isPointerInside = true;
      targetRotY = -0.18 + _pointer.x * 0.42;
      targetRotX = 0.14 - _pointer.y * 0.24;
    };

    const handlePointerLeave = () => {
      isPointerInside = false;
      targetRotX = 0.14;
      targetRotY = -0.18;
    };

    const triggerBasketBounce = () => {
      bounceVelocity = 2.9;
      bounceSpin += Math.PI * 0.65;
      clickCount += 1;
      satellites.forEach((sat) => {
        const dir = sat.basePos.clone().normalize();
        sat.burstOffset.addScaledVector(dir, 0.55);
      });
      bounceCallbackRef.current?.(clickCount);
    };

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      _pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      _raycaster.setFromCamera(_pointer, camera);
      const hits = _raycaster.intersectObject(basketRoot, true);
      if (hits.length > 0 || true) {
        triggerBasketBounce();
      }
    };

    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerleave', handlePointerLeave);
    renderer.domElement.addEventListener('click', handleClick);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 560;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setFallbackActive(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || !gl.fenceSync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      // Spring bounce physics on click
      const springK = 28;
      const damping = 5.5;
      const accel = -springK * bounceHeight - damping * bounceVelocity;
      bounceVelocity += accel * delta;
      bounceHeight += bounceVelocity * delta;
      bounceSpin = THREE.MathUtils.damp(bounceSpin, 0, 4.5, delta);

      // Gentle levitation + cursor parallax
      const floatY = Math.sin(elapsed * 1.45) * 0.11;
      basketRoot.position.y = floatY + bounceHeight;
      basketRoot.position.x = THREE.MathUtils.damp(
        basketRoot.position.x,
        isPointerInside ? _pointer.x * 0.16 : 0,
        4.5,
        delta,
      );
      basketRoot.rotation.x = THREE.MathUtils.damp(basketRoot.rotation.x, targetRotX, 5.5, delta);
      basketRoot.rotation.y = THREE.MathUtils.damp(
        basketRoot.rotation.y,
        targetRotY + Math.sin(elapsed * 0.55) * 0.12 + bounceSpin,
        5.5,
        delta,
      );
      basketRoot.rotation.z = THREE.MathUtils.damp(
        basketRoot.rotation.z,
        isPointerInside ? -_pointer.x * 0.08 : Math.cos(elapsed * 0.7) * 0.03,
        5,
        delta,
      );

      // Contact shadow scales subtly with elevation
      const shadowScale = Math.max(0.75, 1 - (floatY + bounceHeight) * 0.25);
      contactShadow.scale.setScalar(shadowScale);
      contactShadowMat.opacity = Math.max(0.25, 0.72 - (floatY + bounceHeight) * 0.35);

      // Project cursor to Z=0.5 plane for nearby fruit repulsion
      _worldCursor.set(_pointer.x * 2.6, _pointer.y * 1.8, 0.5);

      for (let i = 0; i < satellites.length; i++) {
        const sat = satellites[i];
        const bobY = Math.sin(elapsed * sat.speed + sat.phase) * 0.18;
        const bobX = Math.cos(elapsed * sat.speed * 0.7 + sat.phase) * 0.09;

        if (isPointerInside) {
          _deltaVec.copy(sat.basePos).sub(_worldCursor);
          const dist = _deltaVec.length();
          if (dist < 1.6 && dist > 0.001) {
            const strength = (1 - dist / 1.6) * 0.55;
            _deltaVec.normalize().multiplyScalar(strength);
            sat.repelOffset.x = THREE.MathUtils.damp(sat.repelOffset.x, _deltaVec.x, 7, delta);
            sat.repelOffset.y = THREE.MathUtils.damp(sat.repelOffset.y, _deltaVec.y, 7, delta);
            sat.repelOffset.z = THREE.MathUtils.damp(sat.repelOffset.z, 0.22, 7, delta);
          } else {
            sat.repelOffset.x = THREE.MathUtils.damp(sat.repelOffset.x, 0, 4, delta);
            sat.repelOffset.y = THREE.MathUtils.damp(sat.repelOffset.y, 0, 4, delta);
            sat.repelOffset.z = THREE.MathUtils.damp(sat.repelOffset.z, 0, 4, delta);
          }
        } else {
          sat.repelOffset.x = THREE.MathUtils.damp(sat.repelOffset.x, 0, 3, delta);
          sat.repelOffset.y = THREE.MathUtils.damp(sat.repelOffset.y, 0, 3, delta);
          sat.repelOffset.z = THREE.MathUtils.damp(sat.repelOffset.z, 0, 3, delta);
        }

        sat.burstOffset.x = THREE.MathUtils.damp(sat.burstOffset.x, 0, 4.5, delta);
        sat.burstOffset.y = THREE.MathUtils.damp(sat.burstOffset.y, 0, 4.5, delta);
        sat.burstOffset.z = THREE.MathUtils.damp(sat.burstOffset.z, 0, 4.5, delta);

        sat.mesh.position.set(
          sat.basePos.x + bobX + sat.repelOffset.x + sat.burstOffset.x,
          sat.basePos.y + bobY + sat.repelOffset.y + sat.burstOffset.y,
          sat.basePos.z + sat.repelOffset.z + sat.burstOffset.z,
        );
        sat.mesh.rotation.x += sat.rotSpeed.x * delta;
        sat.mesh.rotation.y += sat.rotSpeed.y * delta;
      }

      // Particle updates
      for (let i = 0; i < particleCount; i++) {
        const pd = particleData[i];
        dummy.position.set(
          pd.base.x + Math.sin(elapsed * pd.speed + pd.phase) * 0.22,
          pd.base.y + Math.cos(elapsed * pd.speed * 0.8 + pd.phase) * 0.25,
          pd.base.z + Math.sin(elapsed * 0.5 + pd.phase) * 0.18,
        );
        dummy.rotation.set(elapsed * pd.speed, elapsed * 0.9 + pd.phase, pd.phase);
        dummy.scale.setScalar(pd.scale);
        dummy.updateMatrix();
        particleMesh.setMatrixAt(i, dummy.matrix);
      }
      particleMesh.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerleave', handlePointerLeave);
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.InstancedMesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      weaveTex.dispose();
      orangeTex.dispose();
      seedTex.dispose();
      mangoTex.dispose();
      shadowTex.dispose();
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (fallbackActive) {
    return (
      <div className="relative w-full h-full flex items-center justify-center p-6">
        <div className="relative w-full max-w-md aspect-square rounded-[2.5rem] bg-gradient-to-br from-[#183D2C] to-[#102B1F] p-6 shadow-2xl overflow-hidden flex flex-col items-center justify-center">
          <img
            src="/assets/aistudio/MANGO_678ef818.jpg"
            alt="Fresh Alphonso Mangoes in woven basket"
            referrerPolicy="no-referrer"
            className="w-72 h-72 object-cover rounded-full border-4 border-[#9BE63C]/40 shadow-xl"
          />
          <p className="mt-4 text-xs font-medium tracking-wide text-[#F8F7F2]/80">
            Morning Harvest Basket · Ready to Deliver
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="w-full h-full cursor-grab active:cursor-grabbing select-none"
      aria-label="Interactive 3D grocery basket filled with fresh fruits and vegetables"
    />
  );
}
