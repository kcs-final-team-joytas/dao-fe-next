'use client'

import Layout from '@components/Layout'
import styles from './page.module.css'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import SelectObjetType from '../components/SelectObjetType'
import ObjetInfoForm from '../components/ObjetInputForm'
import RenderObjet from '../components/RenderObjet'
import { useState } from 'react'

export default function ObjetForm() {
  const [selectedType, setSelectedType] = useState<string>('')

  const isSelected = selectedType !== ''

  return (
    <Layout>
      <div className={styles.globalContainer}>
        <div className={styles.upperContainer}>
          <div>
            <div className={styles.globalTitle}>어떤 오브제인가요?</div>
            <div className={styles.globalSubTitle}>
              공유하고 싶은 추억을 오브제로 만들어보세요!
            </div>
          </div>
          <div className={styles.miniObjetModel}>
            {isSelected && (
              <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
                <OrbitControls enableZoom={false} enableRotate={false} />
                <ambientLight intensity={1.7} />
                <RenderObjet type={selectedType} />
              </Canvas>
            )}
          </div>
        </div>

        <div className={styles.container}>
          {isSelected ? (
            <ObjetInfoForm path='create' type={selectedType} />
          ) : (
            <SelectObjetType setSelectedType={setSelectedType} />
          )}
        </div>
      </div>
    </Layout>
  )
}
