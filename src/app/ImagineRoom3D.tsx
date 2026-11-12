import { Html, Line, OrbitControls, useTexture } from "@react-three/drei"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react"
import * as THREE from "three"
import { A } from "./site-data"

export type RoomKind = "Living room" | "Bedroom" | "Dining nook"

type RoomProps = {
  widthFt: number
  heightFt: number
  widthLabel: string
  heightLabel: string
  wallpaper: string
  wallpaperName: string
  patternScale: number
  after: boolean
  boundary: boolean
  room: RoomKind
  selectedHotspot: number
  onSelectHotspot: (index: number) => void
  resetKey: number
}

const hotspotPositions: [number, number, number][] = [
  [0, 5.7, -4.36],
  [-1.4, 2.35, -2.1],
  [0, 1.05, 0.2],
  [0.55, 1.65, 0.25],
  [-1.4, 0.08, 0.3],
  [3.1, 3.35, -2.3],
]

function WallpaperSurface({
  image,
  width,
  height,
  patternScale,
  visible,
}: {
  image: string
  width: number
  height: number
  patternScale: number
  visible: boolean
}) {
  const loaded = useTexture(`${A}/${image}`)
  const texture = useMemo(() => loaded.clone(), [loaded])
  const material = useRef<THREE.MeshStandardMaterial>(null)

  useEffect(() => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.colorSpace = THREE.SRGBColorSpace
    texture.needsUpdate = true
    return () => texture.dispose()
  }, [texture])

  useEffect(() => {
    texture.repeat.set(
      Math.max(1, width / (3.2 * patternScale)),
      Math.max(1, height / (3.2 * patternScale)),
    )
    texture.needsUpdate = true
  }, [height, patternScale, texture, width])

  useFrame((_, delta) => {
    if (!material.current) return
    material.current.opacity = THREE.MathUtils.damp(
      material.current.opacity,
      visible ? 1 : 0,
      8,
      delta,
    )
  })

  return (
    <mesh position={[0, 0, 0.014]} receiveShadow>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        ref={material}
        map={texture}
        transparent
        opacity={0}
        roughness={0.86}
      />
    </mesh>
  )
}

function RoomShell({
  width,
  height,
  wallpaper,
  patternScale,
  after,
  boundary,
  widthLabel,
  heightLabel,
  room,
}: {
  width: number
  height: number
  wallpaper: string
  patternScale: number
  after: boolean
  boundary: boolean
  widthLabel: string
  heightLabel: string
  room: RoomKind
}) {
  const front = useRef<THREE.Group>(null)
  const floor = useRef<THREE.Mesh>(null)
  const ceiling = useRef<THREE.Mesh>(null)
  const left = useRef<THREE.Mesh>(null)
  const right = useRef<THREE.Mesh>(null)
  const skirting = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    const ease = 10
    if (front.current) {
      front.current.scale.x = THREE.MathUtils.damp(
        front.current.scale.x,
        width,
        ease,
        delta,
      )
      front.current.scale.y = THREE.MathUtils.damp(
        front.current.scale.y,
        height,
        ease,
        delta,
      )
      front.current.position.y = THREE.MathUtils.damp(
        front.current.position.y,
        height / 2,
        ease,
        delta,
      )
    }
    for (const surface of [floor.current, ceiling.current, skirting.current]) {
      if (surface)
        surface.scale.x = THREE.MathUtils.damp(
          surface.scale.x,
          width + 1.2,
          ease,
          delta,
        )
    }
    if (ceiling.current)
      ceiling.current.position.y = THREE.MathUtils.damp(
        ceiling.current.position.y,
        height,
        ease,
        delta,
      )
    if (skirting.current) skirting.current.position.y = 0.12
    if (left.current) {
      left.current.position.x = THREE.MathUtils.damp(
        left.current.position.x,
        -width / 2,
        ease,
        delta,
      )
      left.current.scale.y = THREE.MathUtils.damp(
        left.current.scale.y,
        height,
        ease,
        delta,
      )
      left.current.position.y = THREE.MathUtils.damp(
        left.current.position.y,
        height / 2,
        ease,
        delta,
      )
    }
    if (right.current) {
      right.current.position.x = THREE.MathUtils.damp(
        right.current.position.x,
        width / 2,
        ease,
        delta,
      )
      right.current.scale.y = THREE.MathUtils.damp(
        right.current.scale.y,
        height,
        ease,
        delta,
      )
      right.current.position.y = THREE.MathUtils.damp(
        right.current.position.y,
        height / 2,
        ease,
        delta,
      )
    }
  })

  const outline: [number, number, number][] = [
    [-width / 2, 0, -4.42],
    [-width / 2, height, -4.42],
    [width / 2, height, -4.42],
    [width / 2, 0, -4.42],
    [-width / 2, 0, -4.42],
  ]

  return (
    <>
      <group
        ref={front}
        position={[0, height / 2, -4.5]}
        scale={[width, height, 1]}
      >
        <mesh receiveShadow>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial color="#eee9df" roughness={0.95} />
        </mesh>
        <WallpaperSurface
          key={wallpaper}
          image={wallpaper}
          width={width}
          height={height}
          patternScale={patternScale}
          visible={after}
        />
      </group>
      <mesh
        ref={floor}
        position={[0, -0.1, 0]}
        scale={[width + 1.2, 1, 1]}
        receiveShadow
      >
        <boxGeometry args={[1, 0.18, 9]} />
        <meshStandardMaterial
          color={
            room === "Bedroom"
              ? "#a88d71"
              : room === "Dining nook"
                ? "#76543d"
                : "#9b7356"
          }
          roughness={room === "Dining nook" ? 0.58 : 0.82}
        />
      </mesh>
      <mesh ref={ceiling} position={[0, height, 0]} scale={[width + 1.2, 1, 1]}>
        <boxGeometry args={[1, 0.12, 9]} />
        <meshStandardMaterial color="#f3efe7" />
      </mesh>
      <mesh
        ref={left}
        position={[-width / 2, height / 2, 0]}
        scale={[1, height, 1]}
        receiveShadow
      >
        <boxGeometry args={[0.14, 1, 9]} />
        <meshStandardMaterial color="#e8e1d5" />
      </mesh>
      <mesh
        ref={right}
        position={[width / 2, height / 2, 0]}
        scale={[1, height, 1]}
        receiveShadow
      >
        <boxGeometry args={[0.14, 1, 9]} />
        <meshStandardMaterial color="#e8e1d5" />
      </mesh>
      <mesh
        position={[-width / 2 + 0.08, height * 0.6, -1.05]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <planeGeometry args={[3.5, Math.min(5, height * 0.58)]} />
        <meshStandardMaterial
          color="#c7d8d2"
          emissive="#dceae5"
          emissiveIntensity={0.35}
        />
      </mesh>
      <mesh
        ref={skirting}
        position={[0, 0.12, -4.36]}
        scale={[width + 1.2, 1, 1]}
      >
        <boxGeometry args={[1, 0.24, 0.12]} />
        <meshStandardMaterial color="#d7cfc2" />
      </mesh>
      {boundary && (
        <Line
          points={outline}
          color="#e8a317"
          lineWidth={1.4}
          dashed
          dashSize={0.18}
          gapSize={0.12}
        />
      )}
      <DimensionLabels
        width={width}
        height={height}
        widthLabel={widthLabel}
        heightLabel={heightLabel}
      />
    </>
  )
}

function DimensionLabels({
  width,
  height,
  widthLabel,
  heightLabel,
}: {
  width: number
  height: number
  widthLabel: string
  heightLabel: string
}) {
  return (
    <>
      <Line
        points={[
          [-width / 2, height + 0.35, -4.3],
          [width / 2, height + 0.35, -4.3],
        ]}
        color="#586569"
        lineWidth={1}
      />
      <mesh
        position={[-width / 2, height + 0.35, -4.3]}
        rotation={[0, 0, -Math.PI / 2]}
      >
        <coneGeometry args={[0.12, 0.28, 8]} />
        <meshBasicMaterial color="#586569" />
      </mesh>
      <mesh
        position={[width / 2, height + 0.35, -4.3]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <coneGeometry args={[0.12, 0.28, 8]} />
        <meshBasicMaterial color="#586569" />
      </mesh>
      <Html center position={[0, height + 0.65, -4.3]}>
        <span className="dimension-label">{widthLabel}</span>
      </Html>
      <Line
        points={[
          [width / 2 + 0.4, 0, -4.3],
          [width / 2 + 0.4, height, -4.3],
        ]}
        color="#586569"
        lineWidth={1}
      />
      <mesh position={[width / 2 + 0.4, 0, -4.3]}>
        <coneGeometry args={[0.12, 0.28, 8]} />
        <meshBasicMaterial color="#586569" />
      </mesh>
      <mesh
        position={[width / 2 + 0.4, height, -4.3]}
        rotation={[0, 0, Math.PI]}
      >
        <coneGeometry args={[0.12, 0.28, 8]} />
        <meshBasicMaterial color="#586569" />
      </mesh>
      <Html center position={[width / 2 + 0.75, height / 2, -4.3]}>
        <span className="dimension-label vertical">{heightLabel}</span>
      </Html>
    </>
  )
}

function LivingFurniture() {
  return (
    <group>
      <mesh position={[0, 1, -2.45]} castShadow>
        <boxGeometry args={[6, 1.25, 1.35]} />
        <meshStandardMaterial color="#d7d0c3" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.75, -2.85]} castShadow>
        <boxGeometry args={[5.8, 1.1, 0.45]} />
        <meshStandardMaterial color="#e3ded3" />
      </mesh>
      {[-2, 0, 2].map((x) => (
        <mesh key={x} position={[x, 1.78, -2.52]} castShadow>
          <boxGeometry args={[1.45, 0.85, 0.28]} />
          <meshStandardMaterial color={x === 0 ? "#b7886f" : "#eee9df"} />
        </mesh>
      ))}
      <CoffeeTable />
      <Lamp />
      <Plant />
      <Rug color="#d8cbb7" />
    </group>
  )
}

function BedroomFurniture() {
  return (
    <group>
      <mesh position={[0, 0.65, -1.8]} castShadow>
        <boxGeometry args={[5.7, 1.05, 6.2]} />
        <meshStandardMaterial color="#ddd4c5" />
      </mesh>
      <mesh position={[0, 1.2, -3.7]} castShadow>
        <boxGeometry args={[5.8, 2.4, 0.35]} />
        <meshStandardMaterial color="#bda98f" />
      </mesh>
      <mesh position={[-1.4, 1.25, 0.4]}>
        <boxGeometry args={[1.5, 0.32, 1.2]} />
        <meshStandardMaterial color="#f2eee5" />
      </mesh>
      <mesh position={[1.4, 1.25, 0.4]}>
        <boxGeometry args={[1.5, 0.32, 1.2]} />
        <meshStandardMaterial color="#eee5da" />
      </mesh>
      <Lamp />
      <Plant />
      <Rug color="#cabfae" />
    </group>
  )
}

function DiningFurniture() {
  return (
    <group>
      <mesh position={[0, 1.8, -1]} castShadow>
        <cylinderGeometry args={[2.2, 2.2, 0.28, 48]} />
        <meshStandardMaterial color="#8f6547" />
      </mesh>
      <mesh position={[0, 0.85, -1]}>
        <cylinderGeometry args={[0.38, 0.65, 1.8, 24]} />
        <meshStandardMaterial color="#70503a" />
      </mesh>
      {[-2.7, 2.7].map((x) => (
        <group key={x} position={[x, 0.8, -1]}>
          <mesh>
            <boxGeometry args={[1.1, 0.25, 1.1]} />
            <meshStandardMaterial color="#c5ad8e" />
          </mesh>
          <mesh position={[0, 0.85, 0.45]}>
            <boxGeometry args={[1.1, 1.5, 0.18]} />
            <meshStandardMaterial color="#b89d7b" />
          </mesh>
        </group>
      ))}
      <Plant />
      <Rug color="#d4c5af" />
    </group>
  )
}

function CoffeeTable() {
  return (
    <group>
      <mesh position={[0, 1.15, 0.25]} castShadow>
        <boxGeometry args={[3.5, 0.25, 1.8]} />
        <meshStandardMaterial color="#6f4e3a" />
      </mesh>
      {[-1.35, 1.35].map((x) => (
        <mesh key={x} position={[x, 0.55, 0.25]}>
          <boxGeometry args={[0.18, 1.15, 1.45]} />
          <meshStandardMaterial color="#5d4232" />
        </mesh>
      ))}
    </group>
  )
}

function Lamp() {
  return (
    <group position={[3.15, 0, -2.2]}>
      <mesh position={[0, 2.55, 0]}>
        <cylinderGeometry args={[0.07, 0.1, 5.1, 16]} />
        <meshStandardMaterial
          color="#a77d43"
          metalness={0.65}
          roughness={0.35}
        />
      </mesh>
      <mesh position={[0, 5.05, 0]}>
        <coneGeometry args={[0.72, 1.1, 32, 1, true]} />
        <meshStandardMaterial color="#dfd0b7" side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function Plant() {
  return (
    <group position={[-3.35, 0, -2.4]}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.48, 0.38, 0.9, 24]} />
        <meshStandardMaterial color="#a06f4c" />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[(i - 2) * 0.18, 1.25 + i * 0.2, 0]}
          rotation={[0, 0, (i - 2) * 0.25]}
        >
          <sphereGeometry args={[0.38, 16, 12]} />
          <meshStandardMaterial color="#56705b" />
        </mesh>
      ))}
    </group>
  )
}

function Rug({ color }: { color: string }) {
  return (
    <mesh
      position={[0, 0.015, 0.25]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[7, 4.4]} />
      <meshStandardMaterial color={color} roughness={1} />
    </mesh>
  )
}

function Hotspots({
  selected,
  onSelect,
}: {
  selected: number
  onSelect: (index: number) => void
}) {
  return (
    <>
      {hotspotPositions.map((position, index) => (
        <Html position={position} center key={index}>
          <button
            type="button"
            className={`three-hotspot ${selected === index ? "active" : ""}`}
            onClick={(event) => {
              event.stopPropagation()
              onSelect(index)
            }}
            aria-label={`Select styling hotspot ${index + 1}`}
          >
            {String(index + 1).padStart(2, "0")}
          </button>
        </Html>
      ))}
    </>
  )
}

function RoomScene(
  props: RoomProps & {
    reducedMotion: boolean
    onInteract: () => void
    keyboardAction: string
  },
) {
  const controls = useRef<any>(null)
  const { camera } = useThree()

  useFrame((_, delta) => {
    const targetZ = Math.max(12, props.widthFt * 1.15)
    if (!controls.current?._state || controls.current._state === -1) {
      camera.position.z = THREE.MathUtils.damp(
        camera.position.z,
        targetZ,
        5,
        delta,
      )
    }
  })

  useEffect(() => {
    const control = controls.current
    if (!control || !props.keyboardAction) return
    const key = props.keyboardAction.split(":")[0]
    if (key === "ArrowLeft") control.rotateLeft(0.08)
    if (key === "ArrowRight") control.rotateLeft(-0.08)
    if (key === "ArrowUp") control.rotateUp(0.05)
    if (key === "ArrowDown") control.rotateUp(-0.05)
    if (key === "+" || key === "=") control.dollyIn(1.12)
    if (key === "-") control.dollyOut(1.12)
    control.update()
  }, [props.keyboardAction])

  return (
    <>
      <color attach="background" args={["#e7e1d7"]} />
      <ambientLight intensity={1.25} />
      <directionalLight
        position={[-5, 8, 7]}
        intensity={2.1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight
        position={[-4, 5, 1]}
        intensity={12}
        color="#fff4da"
        distance={12}
      />
      <RoomShell
        width={props.widthFt}
        height={props.heightFt}
        wallpaper={props.wallpaper}
        patternScale={props.patternScale}
        after={props.after}
        boundary={props.boundary}
        widthLabel={props.widthLabel}
        heightLabel={props.heightLabel}
        room={props.room}
      />
      {props.room === "Living room" && <LivingFurniture />}
      {props.room === "Bedroom" && <BedroomFurniture />}
      {props.room === "Dining nook" && <DiningFurniture />}
      {props.after && (
        <Hotspots
          selected={props.selectedHotspot}
          onSelect={props.onSelectHotspot}
        />
      )}
      <OrbitControls
        ref={controls}
        makeDefault
        target={[0, 2.5, -1]}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={8}
        maxDistance={30}
        minAzimuthAngle={-Math.PI * 0.195}
        maxAzimuthAngle={Math.PI * 0.195}
        minPolarAngle={Math.PI * 0.36}
        maxPolarAngle={Math.PI * 0.57}
        autoRotate={!props.reducedMotion}
        autoRotateSpeed={0.22}
        onStart={props.onInteract}
      />
    </>
  )
}

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas")
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"))
  } catch {
    return false
  }
}

export default function ImagineRoom3D(props: RoomProps) {
  const wrapper = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const [interacted, setInteracted] = useState(false)
  const [keyboardAction, setKeyboardAction] = useState("")
  const [webgl] = useState(hasWebGL)
  const [reducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )

  useEffect(() => {
    const element = wrapper.current
    if (!element || !("IntersectionObserver" in window)) return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "120px" },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const keyboard = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (
      ![
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "+",
        "=",
        "-",
      ].includes(event.key)
    )
      return
    event.preventDefault()
    setInteracted(true)
    setKeyboardAction(`${event.key}:${Date.now()}`)
  }

  return (
    <div
      className="three-room"
      ref={wrapper}
      tabIndex={0}
      onKeyDown={keyboard}
      aria-label={`${props.room} virtual room with ${props.wallpaperName} wallpaper on a ${props.widthLabel} by ${props.heightLabel} feature wall. Drag to orbit, scroll to zoom, or use arrow and plus/minus keys.`}
    >
      {!webgl ? (
        <div className="webgl-fallback">
          <img
            src={`${A}/58a47.png`}
            alt="Concept room with wallpaper feature wall"
          />
          <p>
            Your browser cannot display the 3D room. The original concept visual
            is shown instead.
          </p>
        </div>
      ) : (
        <Canvas
          key={props.resetKey}
          shadows="basic"
          dpr={[1, 2]}
          frameloop={visible ? "always" : "never"}
          camera={{ position: [0, 4.5, 13], fov: 47, near: 0.1, far: 100 }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          onPointerDown={() => setInteracted(true)}
        >
          <Suspense fallback={null}>
            <RoomScene
              {...props}
              reducedMotion={reducedMotion || interacted}
              onInteract={() => setInteracted(true)}
              keyboardAction={keyboardAction}
            />
          </Suspense>
        </Canvas>
      )}
    </div>
  )
}
