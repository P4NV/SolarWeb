import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import textureSun from '/public/textures/8k_Sun.jpg'

function Sun() {
    const sunRef = useRef()

    // Load the texture
    const sunTexture = new THREE.TextureLoader().load(textureSun)

    useFrame(() => {
        if (sunRef.current) {
            sunRef.current.rotation.y += 0.001
        }
    })

    return (
        <mesh ref={sunRef}>
            <sphereGeometry args={[2, 32, 32]} />
            <meshStandardMaterial
                map={sunTexture}
                emissive="#ffa500"
                emissiveIntensity={0.15}
            />
        </mesh>
    )
}

export default Sun