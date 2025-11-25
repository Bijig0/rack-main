'use client'
import { Switch } from '@/components/ui/switch'
import { useDashboardContext } from '../barbershop-dashboard-context'

const EditModeButton = () => {
  const { mode, toggleMode } = useDashboardContext()

  return (
    <div className="relative z-50 flex gap-2">
      <Switch checked={mode === 'edit'} onCheckedChange={toggleMode} />
      <p className="mr-1 font-medium">Edit Mode</p>
    </div>
  )
}

export default EditModeButton
