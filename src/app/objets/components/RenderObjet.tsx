import { ObjetInfoFormProps } from '@/types/objetProps'
import { useRef } from 'react'
import { Group } from 'three'
import { objetList } from '@components/models/NewObjetModels'
import { useFrame } from '@react-three/fiber'

export default function RenderObjet({ type }: ObjetInfoFormProps) {
  const ref = useRef<Group>(null)
  const model = objetList.find((objet) => objet.type === type)?.model

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01
    }
  })

  const scale: [number, number, number] =
    type === 'O0001'
      ? [1, 1, 1]
      : type === 'O0002'
      ? [3.5, 3.5, 3.5]
      : [48, 48, 48]

  return (
    <group ref={ref} rotation-y={-Math.PI / 2} scale={scale}>
      {model}
    </group>
  )
}
