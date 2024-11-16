import { Canvas, useThree } from '@react-three/fiber'
import { FlyControls } from '@react-three/drei'
import * as THREE from 'three'
import { useRef, useEffect, useCallback } from 'react'
import styles from './LoungeObjets.module.css'
import { useRouter } from 'next/navigation'
import { URL } from '@/static'
import type { ObjetsProps, Objet } from '@/types/modelType'
import ObjetModels from '@components/models/ObjetModels'
import { toast } from 'react-toastify'
import dynamic from 'next/dynamic'

const NoDataLottie = dynamic(() => import('@components/lotties/NoDataLottie'), {
  ssr: false,
})

function LoungeCanvas({ objets }: { objets?: Objet[] }) {
  const router = useRouter()
  const { camera, gl, scene } = useThree()
  const controlsRef = useRef<any>(null)
  const targetPositionRef = useRef(new THREE.Vector3())
  const initialCameraSet = useRef(false)

  const handleModelClick = useCallback(
    (model: THREE.Group) => {
      const offset = 1
      model.getWorldPosition(targetPositionRef.current)
      camera.position.set(
        targetPositionRef.current.x + offset,
        targetPositionRef.current.y + offset,
        targetPositionRef.current.z + offset
      )
      camera.lookAt(targetPositionRef.current)

      router.push(`${URL.objet}/${model.userData.id}`)
    },
    [camera]
  )

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      )

      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(mouse, camera)

      const intersects = raycaster.intersectObjects(scene.children, true)
      if (intersects.length > 0) {
        const firstIntersected = intersects[0].object
        firstIntersected.userData.onClick?.()
      }
    }

    gl.domElement.style.cursor = 'pointer'
    gl.domElement.addEventListener('click', handleClick)

    return () => {
      gl.domElement.removeEventListener('click', handleClick)
    }
  }, [gl.domElement, camera, scene])

  useEffect(() => {
    if (scene.children.length > 0 && !initialCameraSet.current) {
      const firstModel = scene.children.find(
        (child) => child instanceof THREE.Group
      ) as THREE.Group | undefined

      if (firstModel) {
        firstModel.getWorldPosition(targetPositionRef.current)
        camera.position.set(
          targetPositionRef.current.x + 10,
          targetPositionRef.current.y + 10,
          targetPositionRef.current.z + 10
        )
        camera.lookAt(targetPositionRef.current)
        initialCameraSet.current = true
      }
    }
  }, [scene.children, camera])

  return (
    <>
      <FlyControls ref={controlsRef} movementSpeed={20} rollSpeed={0.2} />
      <ambientLight intensity={4} />
      <directionalLight position={[2, 1, 3]} intensity={1} />
      <ObjetModels objets={objets} onModelClick={handleModelClick} />
    </>
  )
}

export default function LoungeObjets({ objets, loungeId }: ObjetsProps) {
  const router = useRouter()

  const handleClickGoObjet = () => {
    if (loungeId === 0) {
      toast.info('라운지를 선택 후 오브제를 생성해주세요 🙂')
      router.push(URL.lounge)
    } else {
      router.push(URL.newObjet)
    }
  }

  if (!objets || objets.length === 0) {
    return (
      <div className={styles.noDataContainer}>
        <NoDataLottie />
        <div className={styles.innerText}>
          <span>오브제가 없습니다 🥲</span>
          <button className={styles.goObjetButton} onClick={handleClickGoObjet}>
            오브제 생성하러 가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <Canvas style={{ border: '0.1px solid gray' }}>
      <LoungeCanvas objets={objets} />
    </Canvas>
  )
}
