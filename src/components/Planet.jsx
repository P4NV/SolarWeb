import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'


function Planet({ name, radius, map, orbitRadius, speed, onClick }) {
    const planetRef = useRef()
    const orbitRef = useRef()
    const [hovered, setHovered] = useState(false)
    const startTimeRef = useRef(null)
    const baseAngleRef = useRef(Math.random() * Math.PI * 2)

    // Animation settings
    const ANIMATION_DURATION = 6 // 3 seconds in actual time units
    const INTRO_ROTATIONS = 2

    useEffect(() => {
        startTimeRef.current = null
    }, [])

    //animations for the start

    // Ease-out Expo (very dramatic slow-down)
    const easeOutExpo = (t) => {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
    }

    /**********************************************

    // Ease-out Quint (smoother than cubic)
    const easeOutQuint = (t) => {
        return 1 - Math.pow(1 - t, 5)
    }

    // Easing function - starts fast, ends slow (ease-out cubic)
    const easeOutCubic = (t) => {
    return 1 - Math.pow(1 - t, 3)
    }

    // Ease-in-out Cubic (accelerate then decelerate)
    const easeInOutCubic = (t) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    }
    // Ease-out Back (slight overshoot then settles)
    const easeOutBack = (t) => {
    const c1 = 1.70158
    const c3 = c1 + 1
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
    }
    ***********************************************************/
    //animations for the start

    // Spring animation for hover
    const { scale, emissiveIntensity, glowRadius } = useSpring({
            scale: hovered ? 1.4 : 1,
            emissiveIntensity: hovered ? 0.1 : 0,
            glowRadius: hovered ? radius * 1.3 : radius, // for adding glow ring
            config: { tension: 280, friction: 60 }
        })
            /*
            // Bouncy (overshoot effect)
            config: {
              mass: 1,
              tension: 180,
              friction: 12
            }

            // Slow and smooth
            config: {
              mass: 1,
              tension: 120,
              friction: 40
            }

            // Snappy
            config: {
              mass: 0.5,
              tension: 400,
              friction: 30
            }
            config: 'wobbly'  // bouncy
            config: 'stiff'   // quick
            config: 'slow'    // smooth
            config: 'molasses' // very slow
             */

    useFrame(({ clock }) => {
        const elapsed = clock.getElapsedTime()

        // Initialize start time on first frame
        if (startTimeRef.current === null) {
            startTimeRef.current = elapsed
        }

        const timeSinceStart = elapsed - startTimeRef.current
        const progress = Math.min(timeSinceStart / ANIMATION_DURATION, 1)

        // Calculate angle continuously without branching
        const easedProgress = easeOutExpo(progress)
        const introAngle = easedProgress * INTRO_ROTATIONS * Math.PI * 2
        const normalAngle = elapsed * speed
        const angle = baseAngleRef.current + introAngle + normalAngle

        // Orbital motion
        if (orbitRef.current) {
            orbitRef.current.position.x = Math.cos(angle) * orbitRadius
            orbitRef.current.position.z = Math.sin(angle) * orbitRadius
        }

        // Planet rotation
        if (planetRef.current) {
            planetRef.current.rotation.y += 0.01
        }
    })

    return (
        <group ref={orbitRef}>
            {/* Main planet */}
            <animated.mesh
                ref={planetRef}
                onClick={onClick}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                scale={scale}
            >
                <sphereGeometry args={[radius, 32, 32]} />
                <animated.meshStandardMaterial
                    map={map}
                    emissive='#ffffff'
                    emissiveIntensity={emissiveIntensity}
                />
            </animated.mesh>

            {/* Glow ring */}
            <animated.mesh scale={glowRadius / radius}>
                <sphereGeometry args={[radius, 32, 32]} />
                <meshBasicMaterial
                    color="#ffffff"
                    transparent
                    opacity={hovered ? 0.2 : 0}
                />
            </animated.mesh>

            {/* Orbit path */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[orbitRadius - 0.05, orbitRadius + 0.05, 64]} />
                <meshBasicMaterial color="#ffffff" opacity={0.1} transparent />
            </mesh>
        </group>
    )
}

export default Planet