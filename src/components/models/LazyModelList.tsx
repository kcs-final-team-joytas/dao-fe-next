import { lazy, LazyExoticComponent } from 'react'
import { GroupProps } from '@react-three/fiber'

type ModelComponentType = LazyExoticComponent<
  (props: GroupProps) => JSX.Element
>
export const ObjetModelList: Record<string, ModelComponentType> = {
  O0001: lazy(() => import('@assets/models/ObjetModel1')),
  O0002: lazy(() => import('@assets/models/ObjetModel2')),
  O0003: lazy(() => import('@assets/models/ObjetModel3')),
}

export const LoungeModelList: Record<string, ModelComponentType> = {
  L0001: lazy(() => import('@assets/models/LoungeModel1')),
  L0002: lazy(() => import('@assets/models/LoungeModel2')),
  L0003: lazy(() => import('@assets/models/LoungeModel3')),
  L0004: lazy(() => import('@assets/models/LoungeModel4')),
}
