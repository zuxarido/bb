import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback, type MouseEvent } from "react";
import * as THREE from "three";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Sparkles,
  Check,
  ImageIcon,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

import imgNutellaCookie from "@/assets/product-cookie-nutella.png";
import imgDoubleChoc from "@/assets/product-cookie-double.png";
import imgVanillaCake from "@/assets/product-cake-vanilla.png";
import imgDevilsCake from "@/assets/product-cake-devil.png";
import imgCookiePhoto from "@/assets/Cookie_new.png";
import imgCookieDark from "@/assets/Cookie_dark.png";

export const Route = createFileRoute("/cakery")({
  head: () => ({ meta: [{ title: "The Cakery — Bakebook Bakery" }] }),
  component: CakeryPage,
});

/* ------------------------------------------------------------------ */
/*  PRODUCT DATA                                                       */
/*  `image` is the card photo. Set it to `null` for anything you don't */
/*  have real product photography for yet — the shop will render a    */
/*  clean placeholder instead of a broken image, so the page always   */
/*  looks finished. Swap the null for an imported asset the moment    */
/*  a real photo is ready, no other code needs to change.             */
/* ------------------------------------------------------------------ */

type Category = "Cookie" | "Cake" | "Custom";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category: Category;
  description: string;
};

const PRODUCTS: Product[] = [
  {
    id: "cookie-chocchip",
    name: "Chocolate Chip Cookie",
    price: 250,
    image: imgNutellaCookie,
    category: "Cookie",
    description: "Buttery, golden cookie studded with premium chocolate chips.",
  },
  {
    id: "cookie-chocolate",
    name: "Chocolate Cookie",
    price: 300,
    image: imgDoubleChoc,
    category: "Cookie",
    description: "Deep cocoa dough — dense, fudgy, and intensely chocolatey.",
  },
  {
    id: "cake-vanilla",
    name: "Vanilla Caramel Cake",
    price: 880,
    image: imgVanillaCake,
    category: "Cake",
    description: "Vanilla sponge layered with house-made caramel and roasted almonds.",
  },
  {
    id: "cake-devil",
    name: "Devil's Chocolate Cake",
    price: 780,
    image: imgDevilsCake,
    category: "Cake",
    description: "Dark, decadent chocolate sponge finished with a smooth ganache.",
  },
  // Example of a product listed ahead of its photography — replace `image: null`
  // with a real import as soon as the shot exists, everything else just works.
  {
    id: "cake-seasonal",
    name: "Seasonal Special",
    price: 820,
    image: null,
    category: "Cake",
    description: "A rotating monthly flavour, announced on our socials each first week.",
  },
  {
    id: "custom-cake",
    name: "Commission a Cake",
    price: 0,
    image: null,
    category: "Custom",
    description: "Tell us the occasion, flavours and size — we'll design it around you.",
  },
];

// One reference photo so far — you sent the fudgy/crinkle cookie shot, so it's
// wired to "cookie-chocolate". Send a second photo for the chip cookie and add
// its id/image here; until then both use this one so the toy still works end to end.
const COOKIE_PHOTOS: Record<string, string> = {
  "cookie-chocchip": imgCookiePhoto,
  "cookie-chocolate": imgCookieDark,
};

type CartItem = Product & { quantity: number };

type Size = "small" | "medium" | "large";
type ChocTier = "premium" | "luxe";
type CookieConfig = { size: Size; tier: ChocTier; qty: number };

const SIZE_MULTIPLIER: Record<Size, number> = { small: 0.9, medium: 1, large: 1.25 };
const TIER_SURCHARGE: Record<ChocTier, number> = { premium: 0, luxe: 60 };
const DEFAULT_CONFIG: CookieConfig = { size: "medium", tier: "premium", qty: 1 };

function calcUnitPrice(basePrice: number, size: Size, tier: ChocTier) {
  return Math.round(basePrice * SIZE_MULTIPLIER[size] + TIER_SURCHARGE[tier]);
}

function useAnimatedNumber(target: number, duration = 320) {
  const [display, setDisplay] = useState(target);
  const fromRef = useRef(target);
  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (target - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return display;
}

/* ------------------------------------------------------------------ */
/*  PRODUCT PHOTO — a single place that decides real photo vs.         */
/*  placeholder, so every card and modal in the shop looks consistent  */
/*  whether or not photography exists yet.                             */
/* ------------------------------------------------------------------ */

function ProductPhoto({
  src,
  alt,
  className = "",
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-muted to-border/40 ${className}`}
      >
        <ImageIcon className="h-7 w-7 text-foreground/25" strokeWidth={1.5} />
        <span className="editorial-label text-foreground/35 text-center px-6 leading-relaxed">
          Photo coming soon
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  REAL 3D COOKIE — photorealistic procedural dough, textured with    */
/*  the actual product photo where one is supplied. Drag to spin.      */
/*                                                                      */
/*  How the photo is used: the reference photo is painted onto the     */
/*  center of the dough's UV space as the base colour, and the         */
/*  procedural crumb/crack/sugar-dust pass is layered on top of it so  */
/*  the geometry's folds and edges still read correctly in 3D. If a    */
/*  cookie has no photo yet, the same procedural generator produces a  */
/*  fully synthetic dough texture — so the model always looks finished */
/*  even before that cookie has been photographed. Swap in a photo any */
/*  time by adding it to COOKIE_PHOTOS; nothing else needs to change.   */
/* ------------------------------------------------------------------ */

const MINI_LAYOUT = [
  { x: -1.5, z: -0.5, r: 0.15 },
  { x: 1.3, z: -0.7, r: -0.4 },
  { x: -0.75, z: 1.0, r: 0.6 },
  { x: 0.85, z: 1.1, r: -0.2 },
  { x: 0, z: -0.2, r: 0.9 },
  { x: -1.55, z: 1.2, r: -0.7 },
];

type SceneRefs = {
  renderer?: THREE.WebGLRenderer;
  scene?: THREE.Scene;
  camera?: THREE.PerspectiveCamera;
  mainGroup?: THREE.Group;
  soloGroup?: THREE.Group;
  miniGroup?: THREE.Group;
  miniCookies?: THREE.Mesh[];
  size?: Size;
  raf?: number;
  dragging?: { lastX: number; lastY: number } | null;
  velocity: { x: number; y: number };
};

function CookieScene({ photoUrl, size, productId }: { photoUrl?: string; size: Size; productId?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<SceneRefs>({ velocity: { x: 0, y: 0 } });

  useEffect(() => {
    stateRef.current.size = size;
  }, [size]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isDark = productId === "cookie-chocolate" || (photoUrl ?? "").includes("dark");
    let cancelled = false;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(22, 1, 0.1, 100);
    camera.position.set(0, 0.35, 12.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.2);
    keyLight.position.set(4.5, 7.5, 5.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffeaad, 1.4);
    rimLight.position.set(-6, 3, -4);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xdbe6ff, 0.9, 30, 2);
    fillLight.position.set(2.5, 1.8, 4.5);
    scene.add(fillLight);

    /* ---- base dough texture: photo-first, procedural fallback ---- */

    const drawProceduralDough = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const cx = w / 2;
      const cy = h / 2;
      if (isDark) {
        const grad = ctx.createRadialGradient(cx, cy, 100, cx, cy, w / 2);
        grad.addColorStop(0, "#28150d");
        grad.addColorStop(0.35, "#1f0f08");
        grad.addColorStop(0.75, "#150904");
        grad.addColorStop(1, "#0c0402");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      } else {
        const grad = ctx.createRadialGradient(cx, cy, 100, cx, cy, w / 2);
        grad.addColorStop(0, "#fde6ba");
        grad.addColorStop(0.25, "#f7cf88");
        grad.addColorStop(0.55, "#e4a452");
        grad.addColorStop(0.82, "#be6b24");
        grad.addColorStop(1, "#7d3f11");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }
    };

    const drawCrumbAndCracks = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const cx = w / 2;
      const cy = h / 2;

      if (isDark) {
        for (let i = 0; i < 15000; i++) {
          const x = Math.random() * w;
          const y = Math.random() * h;
          const r = 2 + Math.random() * 8;
          ctx.fillStyle = `rgba(${Math.round(20 + Math.random() * 30)}, ${Math.round(10 + Math.random() * 15)}, ${Math.round(5 + Math.random() * 10)}, 0.16)`;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.strokeStyle = "rgba(252, 250, 245, 0.85)";
        ctx.lineWidth = w / 146;
        ctx.lineCap = "round";
        for (let i = 0; i < 24; i++) {
          const angle = (i / 24) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
          const dist = (180 + Math.random() * 650) * (w / 2048);
          const ex = cx + Math.cos(angle) * dist;
          const ey = cy + Math.sin(angle) * dist;
          ctx.beginPath();
          ctx.moveTo(cx + (Math.random() - 0.5) * 80, cy + (Math.random() - 0.5) * 80);
          ctx.quadraticCurveTo(
            (cx + ex) / 2 + (Math.random() - 0.5) * 120,
            (cy + ey) / 2 + (Math.random() - 0.5) * 120,
            ex,
            ey
          );
          ctx.stroke();
        }
        for (let i = 0; i < 4000; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * (w * 0.43);
          const x = cx + Math.cos(angle) * dist;
          const y = cy + Math.sin(angle) * dist;
          ctx.fillStyle = `rgba(255, 252, 248, ${0.1 + Math.random() * 0.35})`;
          ctx.beginPath();
          ctx.arc(x, y, 1 + Math.random() * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        for (let i = 0; i < 20000; i++) {
          const x = Math.random() * w;
          const y = Math.random() * h;
          const rx = 3 + Math.random() * 12;
          const ry = 2 + Math.random() * 10;
          const a = Math.random() * Math.PI * 2;
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(a);
          const isLight = Math.random() > 0.45;
          ctx.fillStyle = isLight
            ? `rgba(255, 248, 230, ${0.1 + Math.random() * 0.22})`
            : `rgba(130, 68, 22, ${0.1 + Math.random() * 0.2})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        ctx.strokeStyle = "rgba(105, 48, 14, 0.6)";
        ctx.lineWidth = w / 227;
        ctx.lineCap = "round";
        for (let i = 0; i < 18; i++) {
          const angle = (i / 18) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
          const dist = (220 + Math.random() * 600) * (w / 2048);
          const ex = cx + Math.cos(angle) * dist;
          const ey = cy + Math.sin(angle) * dist;
          ctx.beginPath();
          ctx.moveTo(cx + (Math.random() - 0.5) * 60, cy + (Math.random() - 0.5) * 60);
          ctx.quadraticCurveTo(
            (cx + ex) / 2 + (Math.random() - 0.5) * 90,
            (cy + ey) / 2 + (Math.random() - 0.5) * 90,
            ex,
            ey
          );
          ctx.stroke();
        }
      }
    };

    const buildTextureCanvas = (photoImg: HTMLImageElement | null) => {
      const canvas = document.createElement("canvas");
      canvas.width = 2048;
      canvas.height = 2048;
      const ctx = canvas.getContext("2d");
      if (!ctx) return canvas;

      drawProceduralDough(ctx, canvas.width, canvas.height);

      if (photoImg) {
        // Lay the real product photo down as the dominant base colour —
        // cropped to a circle so it reads correctly on the round dough —
        // then let the procedural crumb/crack pass sit on top for depth
        // the flat photo alone can't give a bumpy 3D surface.
        ctx.save();
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width * 0.47, 0, Math.PI * 2);
        ctx.clip();
        const scale = Math.max(canvas.width / photoImg.width, canvas.height / photoImg.height) * 1.05;
        const iw = photoImg.width * scale;
        const ih = photoImg.height * scale;
        ctx.globalAlpha = 0.92;
        ctx.drawImage(photoImg, canvas.width / 2 - iw / 2, canvas.height / 2 - ih / 2, iw, ih);
        ctx.globalAlpha = 1;
        ctx.restore();
      }

      ctx.save();
      ctx.globalAlpha = photoImg ? 0.4 : 1;
      drawCrumbAndCracks(ctx, canvas.width, canvas.height);
      ctx.restore();

      return canvas;
    };

    const makeBumpCanvas = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext("2d");
      if (!ctx) return canvas;
      ctx.fillStyle = "#808080";
      ctx.fillRect(0, 0, 1024, 1024);
      for (let i = 0; i < 12000; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const r = 1 + Math.random() * 7;
        const val = Math.floor(Math.random() * 255);
        ctx.fillStyle = `rgb(${val},${val},${val})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      return canvas;
    };

    const bumpTexture = new THREE.CanvasTexture(makeBumpCanvas());
    bumpTexture.colorSpace = THREE.NoColorSpace;

    const chipMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x24120a,
      roughness: 0.22,
      metalness: 0.04,
      clearcoat: 0.35,
      clearcoatRoughness: 0.25,
    });

    const saltMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.08,
      metalness: 0.0,
      transmission: 0.85,
      opacity: 0.95,
      transparent: true,
    });

    const buildDoughMaterial = (photoImg: HTMLImageElement | null) => {
      const doughTexture = new THREE.CanvasTexture(buildTextureCanvas(photoImg));
      doughTexture.colorSpace = THREE.SRGBColorSpace;
      doughTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return new THREE.MeshPhysicalMaterial({
        map: doughTexture,
        bumpMap: bumpTexture,
        bumpScale: 0.07,
        roughness: isDark ? 0.92 : 0.88,
        metalness: 0.02,
        clearcoat: 0.08,
        clearcoatRoughness: 0.9,
      });
    };

    const createPhotorealisticCookie = (doughMaterial: THREE.MeshPhysicalMaterial) => {
      const cookieGroup = new THREE.Group();

      const geometry = new THREE.CylinderGeometry(2.25, 2.18, 0.72, 140, 32);
      const pos = geometry.attributes.position;
      const uvs = geometry.attributes.uv;
      const vec = new THREE.Vector3();

      for (let i = 0; i < pos.count; i++) {
        vec.fromBufferAttribute(pos, i);
        const radial = Math.hypot(vec.x, vec.z);
        const angular = Math.atan2(vec.z, vec.x);

        const rimNoise = Math.sin(angular * 6) * 0.12 + Math.cos(angular * 11) * 0.08 + Math.sin(angular * 17) * 0.05;
        const domeHeight = (1 - Math.pow(radial / 2.3, 2)) * 0.28;
        const surfaceWave = Math.sin(vec.x * 7 + vec.z * 5) * 0.04 + Math.cos(vec.z * 9) * 0.03;

        let nx = vec.x * (1 + rimNoise * 0.6);
        let nz = vec.z * (1 + rimNoise * 0.6);
        let ny = vec.y;

        if (ny > 0) {
          ny += domeHeight + surfaceWave;
        } else {
          ny -= 0.04;
        }

        pos.setXYZ(i, nx, ny, nz);

        const u = nx / 4.6 + 0.5;
        const v = nz / 4.6 + 0.5;
        uvs.setXY(i, Math.max(0, Math.min(1, u)), Math.max(0, Math.min(1, v)));
      }
      geometry.computeVertexNormals();

      const doughMesh = new THREE.Mesh(geometry, doughMaterial);
      doughMesh.castShadow = true;
      doughMesh.receiveShadow = true;
      cookieGroup.add(doughMesh);

      const chipPositions: [number, number, number][] = [
        [-0.9, 0.45, 0.7], [0.15, 0.52, 0.82], [0.92, 0.42, 0.15], [-1.08, 0.38, 0.12], [-0.52, 0.44, 1.18], [0.68, 0.46, 1.12],
        [-0.98, 0.32, 0.88], [0.35, 0.36, 1.38], [0.8, 0.34, 0.85], [1.22, 0.36, -0.18], [0.24, 0.48, -0.95], [-0.38, 0.50, -0.3],
        [1.18, 0.40, -0.78], [-1.2, 0.42, -0.72], [0.18, 0.34, -1.18], [1.05, 0.48, 0.8], [-0.9, 0.52, -0.2], [0.62, 0.54, 0.95],
        [0.0, 0.55, 0.2], [-0.4, 0.48, 0.5], [0.55, 0.46, -0.4], [-0.7, 0.42, -0.9], [1.1, 0.35, 0.4], [-0.15, 0.49, -1.25]
      ];

      chipPositions.forEach(([x, y, z], index) => {
        const isTeardrop = index % 2 === 0;
        let chipMesh: THREE.Mesh;
        if (isTeardrop) {
          const chipGeom = new THREE.ConeGeometry(0.32 + (index % 3) * 0.04, 0.4, 16);
          chipMesh = new THREE.Mesh(chipGeom, chipMaterial);
          chipMesh.rotation.set(0.2, Math.random() * Math.PI, (Math.random() - 0.5) * 0.3);
        } else {
          const chunkGeom = new THREE.DodecahedronGeometry(0.3 + (index % 3) * 0.04);
          chunkGeom.scale(1.2, 0.7, 1.1);
          chipMesh = new THREE.Mesh(chunkGeom, chipMaterial);
          chipMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        }
        chipMesh.position.set(x, y, z);
        chipMesh.castShadow = true;
        cookieGroup.add(chipMesh);
      });

      if (!isDark) {
        for (let i = 0; i < 18; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = 0.3 + Math.random() * 1.6;
          const sx = Math.cos(angle) * dist;
          const sz = Math.sin(angle) * dist;
          const sy = 0.4 + (1 - Math.pow(dist / 2.3, 2)) * 0.26;
          const saltGeom = new THREE.IcosahedronGeometry(0.045, 0);
          saltGeom.scale(1.4, 0.5, 1.2);
          const saltMesh = new THREE.Mesh(saltGeom, saltMaterial);
          saltMesh.position.set(sx, sy, sz);
          saltMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
          cookieGroup.add(saltMesh);
        }
      }

      return cookieGroup;
    };

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    const soloGroup = new THREE.Group();
    const miniGroup = new THREE.Group();
    mainGroup.add(soloGroup);
    mainGroup.add(miniGroup);
    const miniCookies: THREE.Mesh[] = [];

    const populate = (photoImg: HTMLImageElement | null) => {
      if (cancelled) return;
      const doughMaterial = buildDoughMaterial(photoImg);

      const soloCookie = createPhotorealisticCookie(doughMaterial);
      soloCookie.rotation.set(0.18, 0.7, -0.15);
      soloGroup.add(soloCookie);

      MINI_LAYOUT.forEach((layout) => {
        const mini = createPhotorealisticCookie(doughMaterial);
        mini.rotation.set(layout.r, Math.random() * Math.PI, 0);
        mini.scale.setScalar(0);
        miniGroup.add(mini);
        miniCookies.push(mini as unknown as THREE.Mesh);
      });
    };

    // Load the reference photo (if any) before building geometry, so the
    // dough texture is painted with it from the very first frame instead
    // of popping in after load.
    if (photoUrl) {
      const loader = new THREE.ImageLoader();
      loader.setCrossOrigin("anonymous");
      loader.load(
        photoUrl,
        (img) => populate(img as unknown as HTMLImageElement),
        undefined,
        () => populate(null)
      );
    } else {
      populate(null);
    }

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(4.4, 64),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.09 })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -1.45;
    scene.add(shadow);

    stateRef.current.renderer = renderer;
    stateRef.current.scene = scene;
    stateRef.current.camera = camera;
    stateRef.current.mainGroup = mainGroup;
    stateRef.current.soloGroup = soloGroup;
    stateRef.current.miniGroup = miniGroup;
    stateRef.current.miniCookies = miniCookies;
    stateRef.current.size = size;

    function onPointerDown(e: PointerEvent) {
      stateRef.current.dragging = { lastX: e.clientX, lastY: e.clientY };
      container.setPointerCapture(e.pointerId);
      container.style.cursor = "grabbing";
    }
    function onPointerMove(e: PointerEvent) {
      const d = stateRef.current.dragging;
      if (!d) return;
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
      container.style.cursor = "grab";
      try {
        container.releasePointerCapture(e.pointerId);
      } catch {
        // pointer already released
      }
    }

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    container.style.cursor = "grab";
    container.style.touchAction = "none";

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const currentSoloScale = new THREE.Vector3(1.15, 0.65, 1.15);
    const currentMiniScales = MINI_LAYOUT.map(() => 0);

    const animate = (now: number) => {
      const vel = stateRef.current.velocity;
      if (vel && !stateRef.current.dragging) {
        mainGroup.rotation.x += vel.x;
        mainGroup.rotation.y += vel.y;
        vel.x *= 0.94;
        vel.y *= 0.94;
      }

      mainGroup.rotation.y += 0.003;
      mainGroup.position.y = Math.sin(now * 0.0015) * 0.06;

      const currentSize = stateRef.current.size || "medium";
      let targetSoloX = 1.15;
      let targetSoloY = 0.65;
      let targetSoloZ = 1.15;
      let targetMiniScale = 0;

      if (currentSize === "small") {
        targetSoloX = 0;
        targetSoloY = 0;
        targetSoloZ = 0;
        targetMiniScale = 0.52;
      } else if (currentSize === "large") {
        targetSoloX = 1.55;
        targetSoloY = 1.25;
        targetSoloZ = 1.55;
        targetMiniScale = 0;
      }

      currentSoloScale.x += (targetSoloX - currentSoloScale.x) * 0.1;
      currentSoloScale.y += (targetSoloY - currentSoloScale.y) * 0.1;
      currentSoloScale.z += (targetSoloZ - currentSoloScale.z) * 0.1;
      soloGroup.scale.copy(currentSoloScale);
      soloGroup.visible = currentSoloScale.x > 0.01;

      miniCookies.forEach((mini, i) => {
        currentMiniScales[i] += (targetMiniScale - currentMiniScales[i]) * 0.1;
        mini.scale.setScalar(currentMiniScales[i]);
        mini.visible = currentMiniScales[i] > 0.01;

        const layout = MINI_LAYOUT[i];
        const targetX = currentSize === "small" ? layout.x : 0;
        const targetY = currentSize === "small" ? (i % 2 === 0 ? 0.25 : -0.25) : 0;
        const targetZ = currentSize === "small" ? layout.z : 0;

        mini.position.x += (targetX - mini.position.x) * 0.1;
        mini.position.y += (targetY - mini.position.y) * 0.1;
        mini.position.z += (targetZ - mini.position.z) * 0.1;

        mini.rotation.y += 0.01 + i * 0.002;
        mini.rotation.x += 0.004;
      });

      renderer.render(scene, camera);
      stateRef.current.raf = requestAnimationFrame(animate);
    };
    stateRef.current.raf = requestAnimationFrame(animate);

    return () => {
      cancelled = true;
      cancelAnimationFrame(stateRef.current.raf ?? 0);
      ro.disconnect();
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach((mat) => mat.dispose());
        }
      });
      bumpTexture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [photoUrl, productId]);

  return <div ref={containerRef} className="w-full h-full" />;
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                                */
/* ------------------------------------------------------------------ */

const CATEGORY_TABS: Array<{ label: string; value: Category | "All" }> = [
  { label: "Everything", value: "All" },
  { label: "Cookies", value: "Cookie" },
  { label: "Cakes", value: "Cake" },
  { label: "Custom", value: "Custom" },
];

function CakeryPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<Category | "All">("All");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    localStorage.setItem("bakebook-cart-count", String(count));
    window.dispatchEvent(new CustomEvent("bakebook-cart-update", { detail: count }));
  }, [cart]);

  useEffect(() => {
    const handleOpenCart = () => setIsCartOpen(true);
    window.addEventListener("bakebook-open-cart", handleOpenCart);
    return () => window.removeEventListener("bakebook-open-cart", handleOpenCart);
  }, []);

  const addToCart = (product: Product, unitPrice: number, qty = 1) => {
    if (product.category === "Custom") {
      window.open("https://wa.me/919773889591?text=Hi!%20I%20would%20like%20to%20commission%20a%20custom%20cake.", "_blank");
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.price === unitPrice);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.price === unitPrice ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { ...product, price: unitPrice, quantity: qty }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQuantity = Math.max(0, item.quantity + delta);
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const visibleProducts = activeTab === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeTab);

  /* ---- detail modal state (shared by cookies & cakes) ---- */

  const [configs, setConfigs] = useState<Record<string, CookieConfig>>({});
  const [openId, setOpenId] = useState<string | null>(null);
  const [entered, setEntered] = useState(false);
  const [origin, setOrigin] = useState<"left" | "right">("left");
  const [added, setAdded] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const getConfig = (id: string) => configs[id] ?? DEFAULT_CONFIG;
  const patchConfig = (id: string, patch: Partial<CookieConfig>) =>
    setConfigs((prev) => ({ ...prev, [id]: { ...getConfig(id), ...patch } }));

  const openDetail = (product: Product, e: MouseEvent) => {
    if (product.category === "Custom") {
      addToCart(product, 0);
      return;
    }
    const side: "left" | "right" = e.clientX < window.innerWidth / 2 ? "left" : "right";
    setOrigin(side);
    setConfigs((prev) => (prev[product.id] ? prev : { ...prev, [product.id]: DEFAULT_CONFIG }));
    setAdded(false);
    setOpenId(product.id);
  };

  const closeDetail = useCallback(() => {
    setEntered(false);
    clearTimeout(closeTimeout.current);
    closeTimeout.current = setTimeout(() => setOpenId(null), 360);
  }, []);

  useEffect(() => {
    if (!openId) return;
    const raf = requestAnimationFrame(() => setEntered(true));
    closeButtonRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDetail();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [openId, closeDetail]);

  useEffect(() => () => clearTimeout(closeTimeout.current), []);

  const activeProduct = PRODUCTS.find((p) => p.id === openId) ?? null;
  const isCookie = activeProduct?.category === "Cookie";
  const activeConfig = activeProduct ? getConfig(activeProduct.id) : DEFAULT_CONFIG;
  const unitPrice = activeProduct
    ? isCookie
      ? calcUnitPrice(activeProduct.price, activeConfig.size, activeConfig.tier)
      : activeProduct.price
    : 0;
  const animatedUnitPrice = useAnimatedNumber(unitPrice);
  const animatedTotalPrice = useAnimatedNumber(unitPrice * activeConfig.qty);

  const handleAddToBag = () => {
    if (!activeProduct) return;
    addToCart(activeProduct, unitPrice, activeConfig.qty);
    setAdded(true);
    setTimeout(() => {
      setIsCartOpen(true);
      closeDetail();
    }, 620);
  };

  return (
    <div className="min-h-screen bg-muted text-foreground selection:bg-bakebook-blue selection:text-background">
      {/* Floating Cart Button */}
      <div className={`fixed bottom-8 right-8 z-50 transition-all duration-700 ease-out ${isMounted ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}>
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex h-16 w-16 items-center justify-center rounded-full bg-bakebook-blue text-background shadow-xl hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-bakebook-blue/30"
          aria-label="Open Cart"
        >
          <ShoppingBag className="h-6 w-6" strokeWidth={2} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background ring-2 ring-muted animate-in zoom-in duration-300">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Cart Sheet */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="flex w-[70vw] flex-col sm:max-w-md p-0 border-l border-border bg-background shadow-2xl">
          <SheetHeader className="border-b border-border/50 p-8 pb-6">
            <SheetTitle className="display-caps text-3xl tracking-tight text-foreground">Your Bag</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-8">
            {cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center animate-in fade-in duration-500">
                <div className="rounded-full bg-muted p-6 mb-6">
                  <ShoppingBag className="h-8 w-8 text-foreground/30" />
                </div>
                <p className="editorial-label text-muted-foreground">Your bag is empty.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-10 animate-in fade-in duration-500">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.price}`} className="flex gap-6">
                    <div className="h-28 w-24 flex-shrink-0 overflow-hidden bg-muted rounded-lg border border-border/50">
                      <ProductPhoto src={item.image} alt={item.name} className="h-full w-full" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-display text-lg tracking-tight leading-tight pr-4">{item.name}</h4>
                          <button
                            onClick={() => updateQuantity(item.id, -item.quantity)}
                            className="text-muted-foreground hover:text-bakebook-blue transition-colors mt-0.5"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="editorial-label text-muted-foreground mt-2">₹{item.price}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-border rounded-full bg-background">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-muted hover:text-bakebook-blue rounded-l-full transition-colors">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-muted hover:text-bakebook-blue rounded-r-full transition-colors">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="font-display text-lg tracking-tight">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-border/50 p-8 bg-background shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
              <div className="flex justify-between items-end mb-8">
                <span className="editorial-label text-muted-foreground">Subtotal</span>
                <span className="display-caps text-3xl tracking-tight">₹{cartTotal}</span>
              </div>
              <button className="w-full bg-bakebook-blue text-background py-5 text-sm font-semibold tracking-[0.15em] uppercase rounded-full hover:bg-bakebook-ink hover:text-background transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-300">
                Checkout
              </button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 md:grid-cols-[1.1fr_0.9fr] items-center px-6 pt-20 pb-14 md:px-12 md:pt-28 md:pb-20 gap-12">
          <div>
            <p className="editorial-label text-bakebook-blue tracking-[0.2em] opacity-80">— Provisions for the City —</p>
            <h1 className="display-caps mt-6 text-6xl md:text-[76px] leading-[0.98] tracking-tighter">
              Baked slow.
              <br />
              Sold fresh, daily.
            </h1>
            <p className="mt-6 max-w-md text-lg font-light leading-relaxed text-foreground/70">
              Cookies you can spin in your hand before they're even in the oven, cakes cut to order, and
              commissions built around whatever you're celebrating.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#shop"
                className="inline-flex items-center gap-2 bg-bakebook-blue text-background py-4 px-7 rounded-full text-sm font-semibold tracking-[0.1em] uppercase shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Start an order <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/919773889591"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 py-4 px-6 rounded-full text-sm font-medium text-foreground/70 hover:text-bakebook-blue transition-colors"
              >
                <MessageCircle className="h-4 w-4" /> Ask us anything
              </a>
            </div>
          </div>

          <div className="relative h-[340px] md:h-[440px] rounded-[28px] bg-background border border-border/50 shadow-[0_25px_60px_rgba(2,6,23,0.08)] overflow-hidden">
            <CookieScene productId="cookie-chocchip" photoUrl={COOKIE_PHOTOS["cookie-chocchip"]} size="large" />
            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 editorial-label text-muted-foreground bg-background/80 backdrop-blur px-4 py-1.5 rounded-full border border-border/40">
              Drag to spin
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- Shop ---------------- */}
      <section id="shop" className={`mx-auto max-w-[1400px] px-6 py-20 md:px-12 transition-all duration-500 ${openId ? "blur-sm scale-[0.98] pointer-events-none" : ""}`}>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <h2 className="display-caps text-4xl md:text-5xl tracking-tight">The Shop</h2>
            <p className="mt-3 text-foreground/70 max-w-md">Click a cookie to customize it in 3D, or add a cake straight to your bag.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-colors ${
                  activeTab === tab.value
                    ? "bg-bakebook-blue text-background border-bakebook-blue"
                    : "bg-background text-foreground/70 border-border/60 hover:border-bakebook-blue/40 hover:text-bakebook-blue"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleProducts.map((product) => (
            <ShopCard
              key={product.id}
              product={product}
              photoUrl={product.category === "Cookie" ? COOKIE_PHOTOS[product.id] : undefined}
              onOpen={(e) => openDetail(product, e)}
              onQuickAdd={product.category === "Cake" ? () => addToCart(product, product.price, 1) : undefined}
            />
          ))}
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="border-t border-border/60 bg-background">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <p className="display-caps text-2xl tracking-tight">Bakebook Bakery</p>
            <p className="mt-4 text-sm text-foreground/60 max-w-xs leading-relaxed">
              Small-batch cookies and cakes, made to order out of our Gurgaon kitchen.
            </p>
          </div>
          <div>
            <p className="editorial-label text-muted-foreground mb-3">Order</p>
            <a
              href="https://wa.me/919773889591"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-foreground/70 hover:text-bakebook-blue transition-colors inline-flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" /> Message us on WhatsApp
            </a>
          </div>
          <div>
            <p className="editorial-label text-muted-foreground mb-3">Follow</p>
            <p className="text-sm text-foreground/70">@bakebookbakery</p>
          </div>
        </div>
      </footer>

      {/* ---------------- Detail Overlay ---------------- */}
      {openId && activeProduct && (
        <div
          className={`fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-10 transition-opacity duration-300 ${entered ? "opacity-100" : "opacity-0"}`}
          onClick={closeDetail}
        >
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-md" />

          <div
            role="dialog"
            aria-modal="true"
            aria-label={activeProduct.name}
            onClick={(e) => e.stopPropagation()}
            style={{ transformOrigin: origin === "left" ? "20% 50%" : "80% 50%" }}
            className={`relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-[28px] bg-background shadow-2xl border border-border/50 transition-all duration-500 ease-[cubic-bezier(.19,1,.22,1)] ${
              entered ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-6"
            }`}
          >
            <button
              ref={closeButtonRef}
              onClick={closeDetail}
              aria-label="Close"
              className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 border border-border/60 text-foreground/70 hover:text-bakebook-blue hover:border-bakebook-blue/40 transition-colors shadow-md"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Stage: 3D for cookies, photo for cakes */}
              <div className="flex flex-col items-center justify-center bg-muted/60 p-6 md:p-10">
                {isCookie ? (
                  <>
                    <div className="w-full h-[320px] md:h-[380px]">
                      <CookieScene productId={activeProduct.id} photoUrl={COOKIE_PHOTOS[activeProduct.id]} size={activeConfig.size} />
                    </div>
                    <p className="mt-4 editorial-label text-muted-foreground text-center">Drag the cookie to spin it</p>
                  </>
                ) : (
                  <div className="w-full h-[320px] md:h-[380px] rounded-2xl overflow-hidden border border-border/40">
                    <ProductPhoto src={activeProduct.image} alt={activeProduct.name} className="w-full h-full" />
                  </div>
                )}
              </div>

              {/* Details & controls */}
              <div className="flex flex-col p-8 md:p-10">
                <h3 className="font-display text-3xl md:text-4xl tracking-tight">{activeProduct.name}</h3>
                <p className="mt-3 text-foreground/70 leading-relaxed">{activeProduct.description}</p>

                <div className="mt-8 flex flex-col gap-5">
                  {isCookie && (
                    <>
                      <div>
                        <div className="editorial-label text-muted-foreground mb-2">Size</div>
                        <div className="inline-flex rounded-full bg-muted p-1 border border-border/50">
                          {(["small", "medium", "large"] as const).map((s) => (
                            <button
                              key={s}
                              onClick={() => patchConfig(activeProduct.id, { size: s })}
                              className={`px-4 py-2 text-sm rounded-full transition-all ${
                                activeConfig.size === s ? "bg-bakebook-blue text-background shadow-lg" : "text-foreground/70 hover:bg-muted"
                              }`}
                            >
                              {s[0].toUpperCase() + s.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="editorial-label text-muted-foreground mb-2">Chocolate</div>
                        <div className="inline-flex rounded-full bg-muted p-1 border border-border/50">
                          {(["premium", "luxe"] as const).map((t) => (
                            <button
                              key={t}
                              onClick={() => patchConfig(activeProduct.id, { tier: t })}
                              className={`px-4 py-2 text-sm rounded-full transition-all ${
                                activeConfig.tier === t
                                  ? t === "luxe"
                                    ? "bg-amber-600 text-background shadow-lg"
                                    : "bg-bakebook-blue text-background shadow-lg"
                                  : "text-foreground/70 hover:bg-muted"
                              }`}
                            >
                              {t[0].toUpperCase() + t.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <div className="editorial-label text-muted-foreground mb-2">Quantity</div>
                    <div className="inline-flex items-center border border-border rounded-full bg-background">
                      <button
                        onClick={() => patchConfig(activeProduct.id, { qty: Math.max(1, activeConfig.qty - 1) })}
                        className="p-3 hover:bg-muted hover:text-bakebook-blue rounded-l-full transition-colors"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-10 text-center text-sm font-medium">{activeConfig.qty}</span>
                      <button
                        onClick={() => patchConfig(activeProduct.id, { qty: activeConfig.qty + 1 })}
                        className="p-3 hover:bg-muted hover:text-bakebook-blue rounded-r-full transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-10 flex items-end justify-between gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">₹{animatedUnitPrice} each</div>
                    <div className="display-caps text-3xl tracking-tight">₹{animatedTotalPrice}</div>
                  </div>
                  <button
                    onClick={handleAddToBag}
                    disabled={added}
                    className={`flex items-center gap-2 py-4 px-7 rounded-full editorial-label shadow-lg transition-all duration-300 ${
                      added ? "bg-foreground text-background" : "bg-bakebook-blue text-background hover:shadow-xl hover:-translate-y-0.5"
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="h-4 w-4" /> Added
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" /> Add to Bag
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SHOP CARD — one card style for every category                      */
/* ------------------------------------------------------------------ */

function ShopCard({
  product,
  photoUrl,
  onOpen,
  onQuickAdd,
}: {
  product: Product;
  photoUrl?: string;
  onOpen: (e: MouseEvent) => void;
  onQuickAdd?: () => void;
}) {
  const [hovering, setHovering] = useState(false);
  const [added, setAdded] = useState(false);
  const isCookie = product.category === "Cookie";
  const isCustom = product.category === "Custom";

  const cardPhoto = photoUrl ?? product.image;

  const handleQuickAdd = (e: MouseEvent) => {
    e.stopPropagation();
    if (!onQuickAdd) return;
    onQuickAdd();
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen(e as unknown as MouseEvent)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="group flex flex-col rounded-3xl bg-background border border-border/60 shadow-[0_10px_40px_rgba(2,6,23,0.04)] cursor-pointer transition-all duration-500 hover:shadow-[0_25px_60px_rgba(2,6,23,0.08)] focus:outline-none focus-visible:ring-4 focus-visible:ring-bakebook-blue/30 overflow-hidden"
      style={{ transform: hovering ? "translateY(-6px)" : "translateY(0)" }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <ProductPhoto
          src={cardPhoto}
          alt={product.name}
          className="w-full h-full transition-transform duration-500 ease-[cubic-bezier(.2,.9,.25,1)]"
        />
        <div
          className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(.2,.9,.25,1)]"
          style={{ transform: hovering ? "scale(1.05)" : "scale(1)" }}
        />
        {isCookie && (
          <span className="absolute top-4 left-4 editorial-label bg-background/85 backdrop-blur px-3 py-1.5 rounded-full border border-border/40">
            Customize in 3D
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-2xl tracking-tight leading-tight">{product.name}</h3>
          {!isCustom && (
            <div className="text-right whitespace-nowrap">
              <div className="editorial-label text-muted-foreground">{isCookie ? "From" : "Price"}</div>
              <div className="display-caps text-xl">₹{product.price}</div>
            </div>
          )}
        </div>
        <p className="mt-2 text-sm text-foreground/60 leading-relaxed flex-1">{product.description}</p>

        <div className="mt-5 flex items-center justify-between">
          {onQuickAdd ? (
            <button
              onClick={handleQuickAdd}
              disabled={added}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                added ? "bg-foreground text-background" : "bg-bakebook-blue text-background hover:bg-bakebook-ink"
              }`}
            >
              {added ? (
                <>
                  <Check className="h-3.5 w-3.5" /> Added
                </>
              ) : (
                <>
                  <ShoppingBag className="h-3.5 w-3.5" /> Add to Bag
                </>
              )}
            </button>
          ) : (
            <span className="text-sm text-foreground/50">{isCustom ? "Chat with us to start" : "Click to pick it up and spin it in 3D."}</span>
          )}
          <span className="editorial-label text-bakebook-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            {isCustom ? "Message →" : "View →"}
          </span>
        </div>
      </div>
    </div>
  );
}