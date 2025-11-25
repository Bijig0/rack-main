import { BaseInput } from '@/components/ui/base-input'

export function Search() {
  return (
    <div>
      <BaseInput
        type="search"
        placeholder="Search..."
        className="md:w-[100px] lg:w-[300px]"
      />
    </div>
  )
}
