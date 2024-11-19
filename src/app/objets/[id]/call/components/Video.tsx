import { useEffect, useRef, useState, useCallback } from 'react'
import styles from './Video.module.css'
import volumeOff from '@images/volumeOff.png'
import volumeOn from '@images/volumeOn.png'
import Image from 'next/image'

interface Props {
  nickname: string
  stream: MediaStream
  muted?: boolean
  profileImage: string
}

export default function Video({
  profileImage,
  nickname,
  stream,
  muted,
}: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  const [isUserMuted, setIsUserMuted] = useState<boolean>(false)

  const checkSpeaking = useCallback(() => {
    if (analyserRef.current) {
      const bufferLength = analyserRef.current.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      analyserRef.current.getByteFrequencyData(dataArray)

      const maxVolume = Math.max(...dataArray)
      if (maxVolume > 20) {
        setIsSpeaking(true)
      } else {
        setIsSpeaking(false)
      }
    }
  }, [])

  const toggleMuteUser = useCallback(() => {
    setIsUserMuted((prevState) => !prevState)
    stream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled
    })
  }, [stream])

  useEffect(() => {
    if (ref.current && stream) {
      ref.current.srcObject = stream
      audioContextRef.current = new AudioContext()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      const analyser = audioContextRef.current.createAnalyser()

      analyser.fftSize = 256
      analyserRef.current = analyser

      source.connect(analyser)
    }

    const intervalId = setInterval(checkSpeaking, 200)

    if (muted) setIsMuted(muted)

    return () => {
      clearInterval(intervalId)
      if (audioContextRef.current) audioContextRef.current.close()
    }
  }, [stream, muted, checkSpeaking])

  return (
    <div className={styles.container}>
      <img
        className={`${styles.profileImage} ${
          isSpeaking ? styles.isSpeaking : ''
        }`}
        src={profileImage}
        alt='Profile'
      />
      <audio
        className={styles.audioContainer}
        ref={ref}
        muted={isMuted}
        autoPlay
        controls
      />
      <p className={styles.userLabel}>
        {nickname}
        <Image
          className={styles.muteButton}
          onClick={toggleMuteUser}
          src={isUserMuted ? volumeOff : volumeOn}
          alt='Mute'
        />
      </p>
    </div>
  )
}
