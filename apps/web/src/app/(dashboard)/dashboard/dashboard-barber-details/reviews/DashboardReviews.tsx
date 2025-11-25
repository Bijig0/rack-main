'use client'
import EditModeOverlay from '../../EditModeOverlay'
import { useDashboardContext } from '../../barbershop-dashboard-context'
import Reviews from '../../reviews'

const DashboardReviews = () => {
  const { isEditMode } = useDashboardContext()

  return null

  return (
    <section className="relative group">
      <Reviews className={isEditMode ? 'hidden' : ''} />
      <EditModeOverlay isEditMode={isEditMode} />
    </section>
  )
}

export default DashboardReviews
