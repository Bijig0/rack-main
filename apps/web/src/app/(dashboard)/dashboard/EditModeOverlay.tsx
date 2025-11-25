import { cn } from '@/utils/tailwind'

type Props = {
  isEditMode: boolean
  classNames?: string
  onClick?: () => void
}

const EditModeOverlay = (props: Props) => {
  const { isEditMode, classNames, onClick } = props
  if (!isEditMode) return null
  return (
    <div
      onClick={onClick}
      className={cn(
        'absolute inset-0 z-50 flex cursor-pointer items-center justify-center rounded-xl bg-transparent transition-all duration-300 group-hover:scale-105 group-hover:bg-overlay',
        classNames,
      )}
    >
      <button className="hidden text-2xl font-bold text-white group-hover:block">
        Edit
      </button>
    </div>
  )
}

export default EditModeOverlay
