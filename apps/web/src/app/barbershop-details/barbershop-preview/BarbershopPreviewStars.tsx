import { MdOutlineStar } from 'react-icons/md'

type Props = {
  className?: string
}

const BarbershopPreviewStars = (props: Props) => {
  return (
    <div className="flex items-center justify-start gap-1">
      <p className="font-bold">4.4</p>
      <div className="flex">
        <MdOutlineStar />
        <MdOutlineStar />
        <MdOutlineStar />
        <MdOutlineStar />
        <MdOutlineStar />
      </div>
      <a href="/#reviews" className="text-blue-400 underline cursor-pointer">
        (3)
      </a>
    </div>
  )
}

export default BarbershopPreviewStars
