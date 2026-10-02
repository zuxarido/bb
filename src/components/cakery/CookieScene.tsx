import { useEffect, useRef } from "react";
import * as THREE from "three";

export type CookieSize = "small" | "medium" | "large";

type SceneRefs = {
  renderer?: THREE.WebGLRenderer;
  scene?: THREE.Scene;
  camera?: THREE.PerspectiveCamera;
  mainGroup?: THREE.Group;
  soloGroup?: THREE.Group;
  miniGroup?: THREE.Group;
  miniCookies?: THREE.Group[];
  size?: CookieSize;
  raf?: number;
  dragging?: { lastX: number; lastY: number } | null;
  velocity: { x: number; y: number };
  visible: boolean;
};

const MINI_LAYOUT = [
  { x: -1.35, z: -0.45, r: 0.2 },
  { x: 1.2, z: -0.55, r: -0.35 },
  { x: -0.7, z: 0.95, r: 0.5 },
  { x: 0.85, z: 1.05, r: -0.15 },
  { x: 0.05, z: -0.15, r: 0.8 },
  { x: -1.4, z: 1.1, r: -0.55 },
];

function isMobileViewport() {
  return window.matchMedia("(max-width: 767px)").matches;
}

function punchWhiteBackground(image: HTMLImageElement) {
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { canvas, cx: 0.5, cy: 0.5, radius: 0.28 };

  ctx.drawImage(image, 0, 0);
  const { width: w, height: h } = canvas;
  const data = ctx.getImageData(0, 0, w, h);
  const px = data.data;

  let minX = w;
  let minY = h;
  let maxX = 0;
  let maxY = 0;

  for (let i = 0, n = px.length; i < n; i += 4) {
    const r = px[i];
    const g = px[i + 1];
    const b = px[i + 2];
    const brightness = (r + g + b) / 3;
    const sat = Math.max(r, g, b) - Math.min(r, g, b);
    const nearWhite = brightness > 208 && sat < 28;
    const t = nearWhite ? Math.max(0, (228 - brightness) / 22) : 1;
    px[i + 3] = Math.round(px[i + 3] * t);

    if (px[i + 3] > 24) {
      const p = i / 4;
      const x = p % w;
      const y = Math.floor(p / w);
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }

  ctx.putImageData(data, 0, 0);

  const cx = (minX + maxX) / 2 / w;
  const cy = (minY + maxY) / 2 / h;
  const radius = (Math.max(maxX - minX, maxY - minY) / 2 / Math.min(w, h)) * 1.04;
  return { canvas, cx, cy, radius: Math.min(0.48, Math.max(0.18, radius)) };
}

function applyCircularUVs(geometry: THREE.BufferGeometry, meshRadius: number, cx: number, cy: number, radius: number) {
  const uvs = geometry.attributes.uv;
  const pos = geometry.attributes.position;
  for (let i = 0; i < uvs.count; i++) {
    const nx = pos.getX(i) / meshRadius;
    const ny = pos.getY(i) / meshRadius;
    uvs.setXY(i, cx + nx * radius, 1 - (cy + ny * radius));
  }
  uvs.needsUpdate = true;
}

export function CookieScene({
  photoUrl,
  size,
  productId,
}: {
  photoUrl: string;
  size: CookieSize;
  productId?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<SceneRefs>({ velocity: { x: 0, y: 0 }, visible: true });

  useEffect(() => {
    stateRef.current.size = size;
  }, [size]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mobile = isMobileViewport();
    const isDark = productId === "cookie-chocolate" || photoUrl.toLowerCase().includes("dark");
    const crust = isDark ? 0x3a2118 : 0x9a5a2a;
    const underside = isDark ? 0x24140f : 0x6d3b18;
    let disposed = false;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 80);
    camera.position.set(0, mobile ? 2.6 : 2.1, mobile ? 11.2 : 10.4);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !mobile,
      alpha: true,
      powerPreference: mobile ? "low-power" : "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = !mobile;
    if (!mobile) renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.05));
    const key = new THREE.DirectionalLight(0xfff4e6, mobile ? 1.5 : 1.85);
    key.position.set(4, 8, 5);
    if (!mobile) {
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.bias = -0.0002;
    }
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffe7c2, 0.7);
    rim.position.set(-5, 3, -4);
    scene.add(rim);
    const fill = new THREE.PointLight(0xffffff, 0.45, 40, 2);
    fill.position.set(-2, 2, 6);
    scene.add(fill);

    const segs = mobile ? 48 : 72;
    const crustMat = new THREE.MeshStandardMaterial({ color: crust, roughness: 0.92, metalness: 0 });
    const underMat = new THREE.MeshStandardMaterial({ color: underside, roughness: 0.95, metalness: 0 });

    const textures: THREE.Texture[] = [];
    const geometries: THREE.BufferGeometry[] = [];

    const createCookie = (photoMap: THREE.CanvasTexture, cx: number, cy: number, radius: number) => {
      const group = new THREE.Group();
      const topGeo = new THREE.CircleGeometry(2.15, segs);
      applyCircularUVs(topGeo, 2.15, cx, cy, radius);
      const pos = topGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const r = Math.hypot(x, y);
        pos.setZ(i, (1 - Math.pow(r / 2.15, 2)) * 0.22 + Math.sin(x * 6) * 0.02);
      }
      topGeo.computeVertexNormals();
      geometries.push(topGeo);

      const topMat = new THREE.MeshPhysicalMaterial({
        map: photoMap,
        transparent: true,
        roughness: 0.78,
        metalness: 0,
        clearcoat: 0.12,
        clearcoatRoughness: 0.7,
      });
      const top = new THREE.Mesh(topGeo, topMat);
      top.rotation.x = -Math.PI / 2;
      top.position.y = 0.28;
      top.castShadow = !mobile;
      top.receiveShadow = !mobile;
      group.add(top);

      const sideGeo = new THREE.CylinderGeometry(2.12, 2.08, 0.5, segs, 1, true);
      geometries.push(sideGeo);
      const side = new THREE.Mesh(sideGeo, crustMat);
      side.position.y = 0.02;
      side.castShadow = !mobile;
      group.add(side);

      const bottomGeo = new THREE.CircleGeometry(2.08, segs);
      geometries.push(bottomGeo);
      const bottom = new THREE.Mesh(bottomGeo, underMat);
      bottom.rotation.x = Math.PI / 2;
      bottom.position.y = -0.23;
      group.add(bottom);

      return group;
    };

    const mainGroup = new THREE.Group();
    const soloGroup = new THREE.Group();
    const miniGroup = new THREE.Group();
    const miniCookies: THREE.Group[] = [];
    scene.add(mainGroup);
    mainGroup.add(soloGroup);
    mainGroup.add(miniGroup);

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(3.2, 32),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.1 })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -1.35;
    scene.add(shadow);

    stateRef.current.renderer = renderer;
    stateRef.current.scene = scene;
    stateRef.current.camera = camera;
    stateRef.current.mainGroup = mainGroup;
    stateRef.current.soloGroup = soloGroup;
    stateRef.current.miniGroup = miniGroup;
    stateRef.current.miniCookies = miniCookies;
    stateRef.current.size = size;
    stateRef.current.visible = true;

    const loader = new THREE.ImageLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(
      photoUrl,
      (image) => {
        if (disposed) return;
        const { canvas, cx, cy, radius } = punchWhiteBackground(image);
        const photoMap = new THREE.CanvasTexture(canvas);
        photoMap.colorSpace = THREE.SRGBColorSpace;
        photoMap.anisotropy = renderer.capabilities.getMaxAnisotropy();
        textures.push(photoMap);

        const solo = createCookie(photoMap, cx, cy, radius);
        solo.rotation.set(0.22, 0.55, -0.08);
        soloGroup.add(solo);

        const miniCount = mobile ? 4 : MINI_LAYOUT.length;
        for (let i = 0; i < miniCount; i++) {
          const mini = createCookie(photoMap, cx, cy, radius);
          mini.rotation.set(MINI_LAYOUT[i].r, Math.random() * Math.PI, 0);
          mini.scale.setScalar(0);
          miniGroup.add(mini);
          miniCookies.push(mini);
        }
      },
      undefined,
      () => {
        if (disposed) return;
        const fallback = createCookie(new THREE.CanvasTexture(document.createElement("canvas")), 0.5, 0.5, 0.3);
        soloGroup.add(fallback);
      }
    );

    function onPointerDown(e: PointerEvent) {
      stateRef.current.dragging = { lastX: e.clientX, lastY: e.clientY };
      renderer.domElement.setPointerCapture(e.pointerId);
    }

    function onPointerMove(e: PointerEvent) {
      const d = stateRef.current.dragging;
      if (!d) return;
      e.preventDefault();
      const dx = e.clientX - d.lastX;
      const dy = e.clientY - d.lastY;
      d.lastX = e.clientX;
      d.lastY = e.clientY;
      mainGroup.rotation.y += dx * 0.012;
      mainGroup.rotation.x += dy * 0.01;
      stateRef.current.velocity = { x: dy * 0.01, y: dx * 0.012 };
    }

    function onPointerUp(e: PointerEvent) {
      stateRef.current.dragging = null;
      try {
        renderer.domElement.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
    }

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointercancel", onPointerUp);

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const io = new IntersectionObserver(
      ([entry]) => {
        stateRef.current.visible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    io.observe(container);

    const currentSoloScale = new THREE.Vector3(1.05, 0.72, 1.05);
    const currentMiniScales = MINI_LAYOUT.map(() => 0);

    const animate = (now: number) => {
      stateRef.current.raf = requestAnimationFrame(animate);
      if (!stateRef.current.visible) return;

      const vel = stateRef.current.velocity;
      if (!stateRef.current.dragging) {
        mainGroup.rotation.x += vel.x;
        mainGroup.rotation.y += vel.y;
        vel.x *= 0.93;
        vel.y *= 0.93;
        mainGroup.rotation.y += 0.0024;
      }
      mainGroup.position.y = Math.sin(now * 0.0012) * 0.05;

      const currentSize = stateRef.current.size || "medium";
      let targetSoloX = 1.05;
      let targetSoloY = 0.72;
      let targetSoloZ = 1.05;
      let targetMini = 0;

      if (currentSize === "small") {
        targetSoloX = targetSoloY = targetSoloZ = 0;
        targetMini = 0.48;
      } else if (currentSize === "large") {
        targetSoloX = 1.38;
        targetSoloY = 1.15;
        targetSoloZ = 1.38;
      }

      currentSoloScale.lerp(new THREE.Vector3(targetSoloX, targetSoloY, targetSoloZ), 0.1);
      soloGroup.scale.copy(currentSoloScale);
      soloGroup.visible = currentSoloScale.x > 0.02;

      miniCookies.forEach((mini, i) => {
        currentMiniScales[i] += (targetMini - currentMiniScales[i]) * 0.1;
        mini.scale.setScalar(currentMiniScales[i]);
        mini.visible = currentMiniScales[i] > 0.02;
        const layout = MINI_LAYOUT[i];
        const on = currentSize === "small";
        mini.position.x += ((on ? layout.x : 0) - mini.position.x) * 0.1;
        mini.position.y += ((on ? (i % 2 === 0 ? 0.2 : -0.15) : 0) - mini.position.y) * 0.1;
        mini.position.z += ((on ? layout.z : 0) - mini.position.z) * 0.1;
        if (on) mini.rotation.y += 0.006;
      });

      renderer.render(scene, camera);
    };
    stateRef.current.raf = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      cancelAnimationFrame(stateRef.current.raf ?? 0);
      ro.disconnect();
      io.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointercancel", onPointerUp);
      geometries.forEach((g) => g.dispose());
      textures.forEach((t) => t.dispose());
      crustMat.dispose();
      underMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [photoUrl, productId]);

  return <div ref={containerRef} className="h-full w-full touch-none" />;
}
