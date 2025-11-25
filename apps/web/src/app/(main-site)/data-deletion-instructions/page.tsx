import Image from 'next/image'
import ClickSettingsImage from './click-settings.png'
import RemoveInstagramImage from './remove-instagram.png'
const page = () => {
  return (
    <div className="mx-auto mt-8 prose">
      <h1>Data Deletion Instruction</h1>
      <p>
        According to the Facebook Platform rules, we have to provide User Data
        Deletion Callback URL or Data Deletion Instructions URL. If you want to
        delete your activities for TaperAU, follow these instructions:
      </p>
      <ol>
        <li>
          Go to Your Facebook Account’s Setting & Privacy. Click “Setting”.
        </li>
        <li>
          Then, go to “Apps and Websites” and you will see all of your Apps
          activities.
        </li>
        <li>Select the option box for TaperAU</li>
        <li>Click “Remove” button.</li>
      </ol>
      <p>
        If you wish to delete your user account data, you can do that through
        the application.
      </p>
      <ol>
        <li>Navigate to your "Profile"</li>
        <li>Click on "Settings"</li>
        <li>Click on "Profile"</li>
        <li>
          Beside your connected Instagram connected account, click on "Remove"
        </li>
      </ol>
      <div className="">
        <Image src={ClickSettingsImage} alt="click settings" />
        <Image src={RemoveInstagramImage} alt="remove instagram" />
      </div>
      <p>
        Once you confirm this action, your personal data will be permanently
        deleted, and no information will be retained. If you are unable to
        login, you can send us a request to
      </p>
    </div>
  )
}

export default page
