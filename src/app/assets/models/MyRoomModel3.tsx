import React, { useMemo } from 'react'
import * as THREE from 'three'
import { GroupProps } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { BufferGeometry, Material } from 'three'

export default function MyRoomModel3(props: GroupProps) {
  const { nodes, materials } = useGLTF(
    '/models/myRoom_model3/scene.gltf'
  ) as unknown as {
    nodes: Record<string, { geometry: BufferGeometry }>
    materials: Record<string, Material>
  }

  const meshData = useMemo(
    () => ({
      geometry: (nodes.Object_2 as THREE.Mesh).geometry,
      material: materials['Scene_-_Root'],
      position: new THREE.Vector3(-32, -32, 0),
    }),
    [nodes, materials]
  )

  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh
          geometry={meshData.geometry}
          material={meshData.material}
          position={meshData.position}
        />
      </group>
    </group>
  )
}

useGLTF.preload('/models/myRoom_model3/scene.gltf')
