import useUserStore from '@store/userStore'
import { APIs, URL } from '@/static'
import { useRouter } from 'next/navigation'

interface Profile {
  user_id: number
  nickname: string
  profile_url: string
  user_status: string
}

export const useUserInfo = () => {
  const router = useRouter()
  const { updateId, updateNickname, updateProfileImage } = useUserStore()

  const fetchProfile = async (): Promise<Profile | undefined> => {
    try {
      const response = await fetch(APIs.profile, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
      })

      if (response.status === 401) {
        try {
          const reissueResponse = await fetch(APIs.reissueToken, {
            method: 'POST',
            credentials: 'include',
          })

          if (!reissueResponse.ok) throw new Error('Token reissue failed')

          const reissueData = await reissueResponse.json()
          const newAccessToken = reissueData.data.access_token
          localStorage.setItem('access_token', newAccessToken)

          const retryResponse = await fetch(APIs.profile, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
            credentials: 'include',
          })

          if (!retryResponse.ok) throw new Error('Retry profile fetch failed')

          const retryData = await retryResponse.json()
          return retryData.data
        } catch (error) {
          router.push(URL.login)
          return
        }
      } else if (!response.ok) {
        throw new Error('Profile fetch failed')
      }

      const data = await response.json()
      return data.data
    } catch (error) {
      console.error('Error fetching profile:', error)
      return
    }
  }

  const getProfile = async () => {
    try {
      const profile = await fetchProfile()

      if (profile?.user_status === 'ACTIVE_FIRST_LOGIN') {
        router.push(URL.firstProfile)
      } else if (profile) {
        updateNickname(profile.nickname)
        updateProfileImage(profile.profile_url)
        updateId(profile.user_id)
      } else {
        router.push(URL.login)
      }
    } catch (error) {
      console.error('Error getting profile:', error)
      router.push(URL.login)
    }
  }

  return { getProfile }
}
