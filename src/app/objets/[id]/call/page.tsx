'use client'

import styles from './page.module.css'
import mute from '@images/mute.webp'
import unmute from '@images/unmute.webp'
import quitCall from '@images/quitCall.webp'
import { useState } from 'react'
import VideoContainer from './components/VideoContainer'
import { useRouter } from 'next/navigation'
import { URL } from '@/static'
import Image from 'next/image'
import { toast } from 'react-toastify'

export default function ObjetCall({ params }: { params: { id: number } }) {
  const router = useRouter()
  const [muted, setMuted] = useState(false)
  const objetId = params.id

  const loungeId = Number(sessionStorage.getItem('callLoungeId'))

  if (loungeId == 0) {
    toast.info('오브제 페이지를 통해 접속해주세요.')
    router.push(`${URL.objet}/${objetId}`)
    return
  }

  return (
    <>
      {loungeId !== 0 && (
        <div className={styles.middleContainer}>
          <VideoContainer
            muted={muted}
            objetId={objetId}
            loungeId={Number(loungeId)}
          />
        </div>
      )}

      <div className={styles.bottomContainer}>
        <button className={styles.micButton} onClick={() => setMuted(!muted)}>
          <Image alt='' className={styles.icon} src={muted ? mute : unmute} />
        </button>
        <button
          className={styles.callButton}
          onClick={() => router.push(`${URL.objet}/${objetId}`)}
        >
          <Image alt='' className={styles.icon} src={quitCall} />
        </button>
      </div>
    </>
  )
}
