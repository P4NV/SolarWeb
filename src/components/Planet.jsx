import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'

function Planet({ name, radius, color, orbitRadius, speed, onClick }) {
    const planetRef = useRef()
    const orbitRef = useRef()
    const [hovered, setHovered] = useState(false)
    const startTimeRef = useRef(null)
    const baseAngleRef = useRef(Math.random() * Math.PI * 2)

    // Animation settings
    const ANIMATION_DURATION = 4 // 3 seconds in actual time units
    const INTRO_ROTATIONS = 1

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
            <mesh
                ref={planetRef}
                onClick={onClick}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                scale={hovered ? 1.2 : 1}
            >
                <sphereGeometry args={[radius, 32, 32]} />
                <meshStandardMaterial
                    color={color}
                    emissive={hovered ? color : '#000000'}
                    emissiveIntensity={hovered ? 0.3 : 0}
                />
            </mesh>

            {/* Orbit path */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[orbitRadius - 0.05, orbitRadius + 0.05, 64]} />
                <meshBasicMaterial color="#ffffff" opacity={0.1} transparent />
            </mesh>
        </group>
    )
}

export default Planet