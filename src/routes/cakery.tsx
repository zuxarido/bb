import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback, type MouseEvent } from "react";
import * as THREE from "three";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { X, ShoppingBag, Plus, Minus, Sparkles, Check } from "lucide-react";

import imgNutellaCookie from "@/assets/product-cookie-nutella.png";
import imgDoubleChoc from "@/assets/product-cookie-double.png";
import imgVanillaCake from "@/assets/product-cake-vanilla.png";
import imgDevilsCake from "@/assets/product-cake-devil.png";
import imgCookiePhoto from "@/assets/Cookie_new.png";
import imgCookieDark from "@/assets/Cookie_dark.png";
// Photo used to texture the 3D cookie. The project already ships with cookie art assets,
// so the route uses those instead of the missing external file reference.

export const Route = createFileRoute("/cakery")({
  head: () => ({ meta: [{ title: "The Cakery — Bakebook Bakery" }] }),
  component: CakeryPage,
});

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: "Cookie" | "Cake" | "Custom";
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

// ---- Real 3D cookie, textured with the product photo, draggable to spin ----
// Colors for the crust/underside are sampled directly from the photo itself
// (not invented) so the sides match the real cookie's tone.
const CRUST_COLOR = 0x75503f;
const UNDERSIDE_COLOR = 0x402c22;

type SceneRefs = {
  renderer?: THREE.WebGLRenderer;
  scene?: THREE.Scene;
  camera?: THREE.PerspectiveCamera;
  solo?: THREE.Mesh;
  minis?: THREE.Mesh[];
  cookie?: THREE.Mesh;
  raf?: number;
  dragging?: { mesh: THREE.Object3D; lastX: number; lastY: number } | null;
  velocities: Map<THREE.Object3D, { x: number; y: number }>;
};

const MINI_LAYOUT = [
  { x: -1.15, z: -0.35, r: 0.15 },
  { x: 0.95, z: -0.55, r: -0.4 },
  { x: -0.5, z: 0.75, r: 0.6 },
  { x: 0.6, z: 0.85, r: -0.2 },
  { x: 0, z: -0.05, r: 0.9 },
  { x: -1.2, z: 0.95, r: -0.7 },
];

function CookieScene({ photoUrl, size }: { photoUrl: string; size: Size }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<SceneRefs>({ velocities: new Map() });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(22, 1, 0.1, 100);
    camera.position.set(0.1, 0.35, 12.2);
    camera.lookAt(0.1, 0.1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const sceneBackground = new THREE.Color(0xf3f3f1);
    scene.background = sceneBackground;

    scene.add(new THREE.AmbientLight(0xffffff, 0.72));
    const key = new THREE.DirectionalLight(0xfff3dd, 1.8);
    key.position.set(4.2, 7.2, 5.5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xe8efff, 0.9);
    rim.position.set(-6, 2.5, -4);
    scene.add(rim);
    const fill = new THREE.PointLight(0xf7d3ab, 0.8, 25, 2);
    fill.position.set(2.4, 1.5, 4.5);
    scene.add(fill);

    const makeCookieTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 2048;
      canvas.height = 2048;
      const ctx = canvas.getContext("2d");
      if (!ctx) return new THREE.CanvasTexture(canvas);

      const base = ctx.createRadialGradient(980, 760, 120, 1180, 1180, 1700);
      base.addColorStop(0, "#f7deaa");
      base.addColorStop(0.22, "#efc57f");
      base.addColorStop(0.48, "#d79a5f");
      base.addColorStop(0.78, "#b9763b");
      base.addColorStop(1, "#8d5e30");
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < 12000; i += 1) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const rx = 5 + Math.random() * 18;
        const ry = 4 + Math.random() * 16;
        const angle = Math.random() * Math.PI * 2;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillStyle = `rgba(${Math.round(128 + Math.random() * 42)}, ${Math.round(96 + Math.random() * 25)}, ${Math.round(58 + Math.random() * 20)}, ${0.10 + Math.random() * 0.22})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      for (let i = 0; i < 80; i += 1) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const r = 30 + Math.random() * 220;
        const g = ctx.createRadialGradient(x, y, 12, x, y, r);
        g.addColorStop(0, "rgba(90,54,33,0.84)");
        g.addColorStop(0.35, "rgba(70,41,25,0.62)");
        g.addColorStop(1, "rgba(48,22,12,0.04)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return texture;
    };

    const cookieTexture = makeCookieTexture();
    const doughBump = makeCookieTexture();
    doughBump.colorSpace = THREE.NoColorSpace;

    const chipMaterial = new THREE.MeshStandardMaterial({ color: 0x4a2d1d, roughness: 0.9, metalness: 0.08 });

    const geometry = new THREE.SphereGeometry(2.1, 220, 220);
    geometry.scale(1.1, 0.72, 1.08);
    const pos = geometry.attributes.position;
    const vec = new THREE.Vector3();
    for (let i = 0; i < pos.count; i += 1) {
      vec.fromBufferAttribute(pos, i);
      const radial = Math.hypot(vec.x, vec.z);
      const angular = Math.atan2(vec.z, vec.x);
      const waveA = Math.sin(vec.x * 9.5 + vec.z * 6.5 + vec.y * 3.5) * 0.08;
      const waveB = Math.cos(vec.y * 12 + radial * 9.5) * 0.06;
      const softness = 1 - Math.abs(vec.y) * 0.58;
      const radius = 1 + (waveA + waveB) * softness;
      const nx = Math.cos(angular) * radial * radius;
      const nz = Math.sin(angular) * radial * radius;
      const ny = vec.y * (0.96 + Math.sin(radial * 12) * 0.025) + (waveA + waveB) * 0.05;
      pos.setXYZ(i, nx, ny, nz);
    }
    geometry.computeVertexNormals();

    const cookie = new THREE.Mesh(
      geometry,
      new THREE.MeshPhysicalMaterial({
        map: cookieTexture,
        bumpMap: doughBump,
        bumpScale: 0.06,
        roughness: 0.92,
        metalness: 0.03,
        clearcoat: 0.11,
        clearcoatRoughness: 0.95,
      })
    );
    cookie.castShadow = true;
    cookie.receiveShadow = true;
    cookie.rotation.set(0.12, 0.8, -0.22);
    cookie.position.set(0, 0.2, 0);
    scene.add(cookie);

    const chipPositions = [
      [-0.9, 1.05, 0.7], [0.15, 1.38, 0.82], [0.92, 1.02, 0.15], [-1.08, 0.7, 0.12], [-0.52, 0.72, 1.18], [0.68, 0.8, 1.12],
      [-0.98, 0.15, 0.88], [0.35, 0.2, 1.38], [0.8, 0.14, 0.85], [1.22, 0.72, -0.18], [0.24, 1.52, -0.95], [-0.38, 1.62, -0.3],
      [1.18, 1.12, -0.78], [-1.2, 1.28, -0.72], [0.18, 0.34, -1.18], [1.05, 1.6, 0.8], [-0.9, 1.82, -0.2], [0.62, 1.88, 0.95],
      [-0.22, 1.7, 1.52], [1.2, 0.75, 0.92], [-1.42, 0.72, -0.16], [0.12, 0.92, -1.5], [0.96, 0.3, -1.18], [-0.5, 0.24, -1.32],
      [0.12, 0.8, 1.76], [-1.12, 1.74, 0.56], [0.85, 1.68, -0.8], [-0.06, 1.2, -1.5], [1.38, 0.18, 0.2], [0.4, 1.9, 0.32], [-0.7, 1.96, -0.65]
    ];

    chipPositions.forEach(([x, y, z], index) => {
      const chip = new THREE.Mesh(new THREE.SphereGeometry(0.33 + (index % 4) * 0.06, 38, 38), chipMaterial);
      chip.position.set(x, y, z);
      chip.scale.set(1.08, 0.92, 1.12);
      chip.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      cookie.add(chip);
    });

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(3.8, 64),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.08 })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -1.25;
    scene.add(shadow);

    stateRef.current.renderer = renderer;
    stateRef.current.scene = scene;
    stateRef.current.camera = camera;
    stateRef.current.cookie = cookie;

    const raycaster = new THREE.Raycaster();
    const pointerNDC = new THREE.Vector2();

    function onPointerDown(e: PointerEvent) {
      const rect = container.getBoundingClientRect();
      pointerNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNDC, camera);
      const hits = raycaster.intersectObject(cookie);
      if (hits.length > 0) {
        stateRef.current.dragging = { mesh: cookie, lastX: e.clientX, lastY: e.clientY };
        container.setPointerCapture(e.pointerId);
        container.style.cursor = "grabbing";
      }
    }

    function onPointerMove(e: PointerEvent) {
      const d = stateRef.current.dragging;
      if (!d) return;
      const dx = e.clientX - d.lastX;
      const dy = e.clientY - d.lastY;
      d.lastX = e.clientX;
      d.lastY = e.clientY;
      cookie.rotation.y += dx * 0.013;
      cookie.rotation.x += dy * 0.011;
      stateRef.current.velocities.set(cookie, { x: dy * 0.011, y: dx * 0.013 });
    }

    function onPointerUp(e: PointerEvent) {
      stateRef.current.dragging = null;
      container.style.cursor = "grab";
      try {
        container.releasePointerCapture(e.pointerId);
      } catch {
        // pointer was already released
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

    let last = performance.now();
    const animate = (now: number) => {
      const vel = stateRef.current.velocities.get(cookie);
      if (vel && !stateRef.current.dragging) {
        cookie.rotation.x += vel.x;
        cookie.rotation.y += vel.y;
        vel.x *= 0.94;
        vel.y *= 0.94;
      }

      cookie.rotation.y += 0.0025;
      cookie.rotation.x = 0.08 + Math.sin(now * 0.0012) * 0.08;
      cookie.position.y = 0.2 + Math.sin(now * 0.0015) * 0.04;

      renderer.render(scene, camera);
      stateRef.current.raf = requestAnimationFrame(animate);
    };
    stateRef.current.raf = requestAnimationFrame(animate);

    return () => {
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
      cookieTexture.dispose();
      doughBump.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [photoUrl]);

  useEffect(() => {
    const cookie = stateRef.current.cookie;
    if (!cookie) return;
    const target = size === "small" ? 0.8 : size === "medium" ? 1.18 : 1.45;
    cookie.scale.setScalar(target);
  }, [size]);

  return <div ref={containerRef} className="w-full h-full" />;
}

function CakeryPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync cart count with global SiteHeader
  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    localStorage.setItem("bakebook-cart-count", String(count));
    window.dispatchEvent(new CustomEvent("bakebook-cart-update", { detail: count }));
  }, [cart]);

  // Listen to open-cart event from global header
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
      // Matched on id + price so two different customizations of the same
      // cookie sit as separate lines instead of merging into a wrong price.
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

  // ---- Per-cookie detail view ----
  const cookies = PRODUCTS.filter((p) => p.category === "Cookie");

  const [configs, setConfigs] = useState<Record<string, CookieConfig>>({});
  const [openId, setOpenId] = useState<string | null>(null);
  const [entered, setEntered] = useState(false);
  const [origin, setOrigin] = useState<"left" | "right">("left");
  const [added, setAdded] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout>>();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const getConfig = (id: string) => configs[id] ?? DEFAULT_CONFIG;
  const patchConfig = (id: string, patch: Partial<CookieConfig>) =>
    setConfigs((prev) => ({ ...prev, [id]: { ...getConfig(id), ...patch } }));

  const openDetail = (product: Product, e: MouseEvent) => {
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

  const activeProduct = cookies.find((c) => c.id === openId) ?? null;
  const activeConfig = activeProduct ? getConfig(activeProduct.id) : DEFAULT_CONFIG;
  const unitPrice = activeProduct ? calcUnitPrice(activeProduct.price, activeConfig.size, activeConfig.tier) : 0;
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
      {/* Soft Header */}
      <header className="absolute top-0 z-40 w-full px-6 py-8 md:px-10 flex justify-center">
        <p className="editorial-label text-bakebook-blue tracking-[0.2em] opacity-80 animate-in fade-in slide-in-from-top-4 duration-1000 ease-out fill-mode-both delay-300">
          — Provisions for the City —
        </p>
      </header>

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
        <SheetContent className="flex w-full flex-col sm:max-w-md p-0 border-l border-border bg-background shadow-2xl">
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
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
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

      {/* Hero Section */}
      <section className="mx-auto w-full max-w-[1600px] px-6 pt-28 pb-10 md:px-12 text-center">
        <h1 className="display-caps text-6xl md:text-[72px] leading-tight tracking-tighter mx-auto max-w-4xl">
          The Cookies — Crafted to Hold
        </h1>
        <p className="mt-6 mx-auto max-w-2xl text-lg font-light leading-relaxed text-foreground/70">
          Two carefully crafted cookies. Click one to step inside — spin it in your hands, customize it, make it yours.
        </p>
      </section>

      {/* Cookie Grid */}
      <section className={`mx-auto max-w-[1400px] px-6 pb-28 md:px-12 transition-all duration-500 ${openId ? "blur-sm scale-[0.98] pointer-events-none" : ""}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {cookies.map((prod) => (
            <CookiePreviewCard key={prod.id} product={prod} photoUrl={COOKIE_PHOTOS[prod.id]} onOpen={(e) => openDetail(prod, e)} />
          ))}
        </div>
      </section>

      {/* Detail Overlay — a real, draggable 3D cookie, opened as its own page */}
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
              {/* 3D cookie stage */}
              <div className="flex flex-col items-center justify-center bg-muted/60 p-6 md:p-10">
                <div className="w-full h-[320px] md:h-[380px]">
                  <CookieScene photoUrl={COOKIE_PHOTOS[activeProduct.id]} size={activeConfig.size} />
                </div>
                <p className="mt-4 editorial-label text-muted-foreground text-center">
                  {activeConfig.size === "small" ? "Drag any cookie to spin it" : "Drag the cookie to spin it"}
                </p>
              </div>

              {/* Details & controls */}
              <div className="flex flex-col p-8 md:p-10">
                <h3 className="font-display text-3xl md:text-4xl tracking-tight">{activeProduct.name}</h3>
                <p className="mt-3 text-foreground/70 leading-relaxed">{activeProduct.description}</p>

                <div className="mt-8 flex flex-col gap-5">
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

// ---- Preview card shown in the grid before a cookie is opened ----
function CookiePreviewCard({
  product,
  photoUrl,
  onOpen,
}: {
  product: Product;
  photoUrl: string;
  onOpen: (e: MouseEvent) => void;
}) {
  const [hovering, setHovering] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen(e as unknown as MouseEvent)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="group w-full max-w-[520px] mx-auto p-8 rounded-3xl bg-background border border-border/60 shadow-[0_10px_40px_rgba(2,6,23,0.04)] cursor-pointer transition-all duration-500 hover:shadow-[0_25px_60px_rgba(2,6,23,0.08)] focus:outline-none focus-visible:ring-4 focus-visible:ring-bakebook-blue/30"
      style={{ transform: hovering ? "translateY(-6px)" : "translateY(0)" }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display text-3xl tracking-tight">{product.name}</h3>
          <p className="mt-2 text-sm text-foreground/70 max-w-lg">{product.description}</p>
        </div>
        <div className="text-right">
          <div className="editorial-label text-muted-foreground">Starting</div>
          <div className="display-caps text-2xl">₹{product.price}</div>
        </div>
      </div>

      <div className="relative flex items-center justify-center p-6">
        <div
          className="relative w-[220px] h-[220px] md:w-[260px] md:h-[260px] rounded-full overflow-hidden transition-transform duration-500 ease-[cubic-bezier(.2,.9,.25,1)]"
          style={{
            transform: hovering ? "rotate(-4deg) scale(1.04)" : "rotate(0deg) scale(1)",
            boxShadow: hovering ? "0 25px 50px rgba(2,6,23,0.14)" : "0 14px 32px rgba(2,6,23,0.08)",
          }}
        >
          <img src={photoUrl} alt={product.name} className="h-full w-full object-cover" draggable={false} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-foreground/60">Click to pick it up and spin it in 3D.</p>
        <span className="editorial-label text-bakebook-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          View →
        </span>
      </div>
    </div>
  );
}
