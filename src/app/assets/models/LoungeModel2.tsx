import { useGLTF } from '@react-three/drei'
import { GroupProps } from '@react-three/fiber'
import { useMemo } from 'react'
import React from 'react'
import { MeshData } from '@/types/modelType'
import { BufferGeometry, Material } from 'three'

const MemoizedMesh = React.memo(
  ({ geometry, material, position, rotation }: MeshData) => (
    <mesh
      geometry={geometry}
      material={material}
      position={position}
      rotation={rotation}
    />
  )
)

MemoizedMesh.displayName = 'MemoizedMesh'

export default function LoungeModel2(props: GroupProps) {
  const { nodes, materials } = useGLTF(
    '/models/lounge_model2/scene.gltf'
  ) as unknown as {
    nodes: Record<string, { geometry: BufferGeometry }>
    materials: Record<string, Material>
  }

  const meshData = useMemo<MeshData>(
    () => ({
      geometry: nodes.Object_Planet_0.geometry,
      material: materials.Planet,
      position: [-0.045, 0.3, 0.066],
      rotation: [Math.PI, 0, Math.PI],
    }),
    [nodes, materials]
  )

  return (
    <group {...props} dispose={null}>
      <MemoizedMesh {...meshData} />
    </group>
  )
}

useGLTF.preload('/models/lounge_model2/scene.gltf')
