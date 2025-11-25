import { Separator } from '@/components/ui/separator'
import ProfileForm from './profile-form'

export default function SettingsProfile() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Public Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
        <a href="/dashboard" className="text-sm text-blue-400 underline">
          Edit
        </a>
      </div>
      <Separator className="my-4" />
      {/* <ProfileForm /> */}
    </div>
  )
}
