import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function Sun() {
    const sunRef = useRef()

    useFrame(() => {
        if (sunRef.current) {
            sunRef.current.rotation.y += 0.001
        }
    })

    return (
        <mesh ref={sunRef}>
            <sphereGeometry args={[2, 32, 32]} />
            <meshStandardMaterial
                color="#ffa500"
                emissive="#ffa500"
                emissiveIntensity={0.8}
            />
        </mesh>
    )
}

export default Sun