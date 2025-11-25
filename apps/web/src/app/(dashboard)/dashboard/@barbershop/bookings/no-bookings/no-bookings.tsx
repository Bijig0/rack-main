import { FaCalendarAlt } from 'react-icons/fa'

type Props = {
  title: string
  subtitle: string
}

const NoUpComingBookings = ({ title, subtitle }: Props) => {
  return (
    <div>
      <FaCalendarAlt size={36} />
      <h2>{title}</h2>
      <h2>{subtitle}</h2>
    </div>
  )
}

export default NoUpComingBookings
