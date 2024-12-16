'use client'

import dynamic from 'next/dynamic'

const MyRoomObjet = dynamic(() => import('./components/objetsContainer'), {
  ssr: false,
})

export default MyRoomObjet
