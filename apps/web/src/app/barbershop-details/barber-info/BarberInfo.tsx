import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/utils/tailwind'

type Props = {
  className?: string
  title: () => React.ReactNode
  // name: () => React.ReactNode,
  instagramLink: () => React.ReactNode
  address: () => React.ReactNode
  bookingWebsite: () => React.ReactNode
  bookNowButton: () => React.ReactNode
}

const BarberInfo = (props: Props) => {
  const {
    className,
    title,
    // name,
    instagramLink,
    address,
    bookingWebsite,
    bookNowButton,
  } = props
  return (
    <Card className={cn('rounded-xl', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        {title()}
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-2 lg:mt-2">
        {/* <BarberAvatar /> */}
        {/* <div className="flex items-center justify-start gap-1">
          <FaScissors size={18} />
          <p className="font-bold">Independent</p>
        </div> */}
        {/* {name()} */}
        {instagramLink()}
        {address()}
        {bookingWebsite()}
        {bookNowButton()}
      </CardContent>
    </Card>
  )
}

export default BarberInfo
