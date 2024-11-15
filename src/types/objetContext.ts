import { createContext, useContext } from 'react'

export interface Objet {
  objet_id: number
  lounge_id?: number
  objet_type: 'O0001' | 'O0002' | 'O0003'
  name: string
  description: string
  created_at: string
  objet_image: string
  owner: {
    nickname: string
    profile_image: string
    user_id: number
  }
}
interface ObjetContextType {
  objetData: Objet | undefined
  callingPeople: number
}

export const ObjetContext = createContext<ObjetContextType | null>(null)
export const useObjetContext = () => useContext(ObjetContext)
