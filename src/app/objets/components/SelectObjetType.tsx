import styles from './SelectObjetType.module.css'
import left from '@images/left.webp'
import right from '@images/right.webp'
import { useState, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Vector3, Group, Box3 } from 'three'
import { ObjetModelList } from '@components/models/LazyModelList'
import Image from 'next/image'

interface ObjetProps {
  setSelectedType: (type: string) => void
}

export default function SelectObjetType({ setSelectedType }: ObjetProps) {
  const [currentModelIndex, setCurrentModelIndex] = useState(0)
  const modelTypes = ['O0001', 'O0002', 'O0003']

  const CurrentModel = () => <Model index={currentModelIndex} />

  const handleLeftClick = () => {
    setCurrentModelIndex((prevIndex) => (prevIndex === 0 ? 2 : prevIndex - 1))
  }

  const handleRightClick = () => {
    setCurrentModelIndex((prevIndex) => (prevIndex === 2 ? 0 : prevIndex + 1))
  }

  const handleSelectClick = () => {
    setSelectedType(modelTypes[currentModelIndex])
  }

  return (
    <>
      <div className={styles.objetModel}>
        <Canvas
          style={{ width: '100%', height: '100%' }}
          camera={{ position: [0, 0, 4], fov: 50 }}
        >
          <ambientLight intensity={5} />
          <CurrentModel />
        </Canvas>
      </div>
      <div className={styles.modelIndexText}>{currentModelIndex + 1} / 3</div>
      <div className={styles.chooseContainer}>
        <Image
          className={styles.moveIcon}
          src={left.src}
          width={25}
          height={25}
          alt='Left Arrow'
          onClick={handleLeftClick}
        />
        <button className={styles.chooseButton} onClick={handleSelectClick}>
          선택
        </button>
        <Image
          className={styles.moveIcon}
          src={right.src}
          width={25}
          height={25}
          alt='Right Arrow'
          onClick={handleRightClick}
        />
      </div>
    </>
  )
}

function CenterModel({ children }: { children: React.ReactNode }) {
  const ref = useRef<Group>(null)
  const { scene } = useThree()

  useEffect(() => {
    if (ref.current) {
      const box = new Box3().setFromObject(ref.current)
      const center = box.getCenter(new Vector3())
      ref.current.position.sub(center)
    }
  }, [scene])

  return <group ref={ref}>{children}</group>
}

function Model({ index }: { index: number }) {
  const ref = useRef<Group>(null)

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01
    }
  })
  return (
    <group position={new Vector3(0, 0, 0)}>
      <CenterModel>
        <group ref={ref}>
          {index === 0 ? (
            <ObjetModelList.O0001 scale={3.2} />
          ) : index === 1 ? (
            <ObjetModelList.O0002 scale={1.3} />
          ) : (
            <ObjetModelList.O0003 scale={2} />
          )}
        </group>
      </CenterModel>
    </group>
  )
}
