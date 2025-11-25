'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const BarberAvatar = () => {
  return (
    <Avatar className="self-center">
      <AvatarImage
        className="w-16 rounded-full"
        src="https://yt3.googleusercontent.com/6UiwfdsMr2ymXIAOPoDAvnmQMoqurkkpcHeVw3PSqIP669s5Oiv1w_Ill682ZOy2F7EO_jOK=s900-c-k-c0x00ffffff-no-rj"
        alt="Featured Haircut"
      />
      <AvatarFallback>HC</AvatarFallback>
    </Avatar>
  )
}

export default BarberAvatar
