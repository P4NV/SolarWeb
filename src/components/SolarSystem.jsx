import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { useState } from 'react'
import * as THREE from 'three'
import Planet from './Planet'
import Sun from './Sun'

// Load the texture
const MerTex = new THREE.TextureLoader().load('/textures/Mercury.png')
const VenTex = new THREE.TextureLoader().load('/textures/Venus.jpg')
const RthTex = new THREE.TextureLoader().load('/textures/Earth.jpg')
const MarTex = new THREE.TextureLoader().load('/textures/Mars.jpg')
const JupTex = new THREE.TextureLoader().load('/textures/Jupiter.jpg')
const SatTex = new THREE.TextureLoader().load('/textures/Saturn.jpg')


const planetsData = [
    { name: 'Mercury', radius: 0.4, map:MerTex, orbitRadius: 6, speed: 0.16, content: 'About Me & Skills - Learn about my background and expertise' },//default speed = 0.04
    { name: 'Venus', radius: 0.6, map:VenTex, orbitRadius: 9, speed: 0.12, content: 'Contact & Social - Get in touch with me' },//default speed = 0.03
    { name: 'Earth', radius: 0.65, map:RthTex, orbitRadius: 12, speed: 0.08, content: 'Project #1 - E-commerce Platform with React and Node.js' },//default speed = 0.02
    { name: 'Mars', radius: 0.5, map:MarTex, orbitRadius: 15, speed: 0.072, content: 'Project #2 - Dashboard Analytics App with real-time data' },//default speed = 0.018
    { name: 'Jupiter', radius: 1.4, map:JupTex, orbitRadius: 20, speed: 0.04, content: 'Major Case Study - Enterprise CRM System' },//default speed = 0.01
    { name: 'Saturn', radius: 1.2, map:SatTex, orbitRadius: 25, speed: 0.0032, content: 'Project #3 - Mobile-First Social Platform' },//default speed = 0.008
]

function SolarSystem() {
    const [selectedPlanet, setSelectedPlanet] = useState(null)

    return (
        <>
            {selectedPlanet && (
                <div className="info-panel">
                    <button className="close-btn" onClick={() => setSelectedPlanet(null)}>
                        ×
                    </button>
                    <h2>{selectedPlanet.name}</h2>
                    <p>{selectedPlanet.content}</p>
                </div>
            )}

            <Canvas camera={{ position: [0, 10, 35], fov: 60 }}>
                <ambientLight intensity={0.3} />
                <pointLight position={[0, 0, 0]} intensity={2} color="#ffa500" />

                {/* Stars background */}
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                {/* Sun */}
                <Sun />

                {/* Planets */}
                {planetsData.map((planet) => (
                    <Planet
                        key={planet.name}
                        {...planet}
                        onClick={() => setSelectedPlanet(planet)}
                    />
                ))}

                {/* Camera controls */}
                <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    minDistance={15}
                    maxDistance={60}
                />
            </Canvas>
        </>
    )
}

export default SolarSystem