import { Separator } from '@/components/ui/separator'
import { BookingsListPreview } from './bookings-list-preview'

export default function BookingsProfile() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Bookings</h3>
        <p className="text-sm text-muted-foreground">
          See upcoming and past events booked through your event type links.
        </p>
      </div>
      <Separator className="my-4" />
      <BookingsListPreview />
    </div>
  )
}
