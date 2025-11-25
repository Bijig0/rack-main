'use client'
import CollapsibleText from '@/components/CollapsibleText'
import { cn } from '@/utils/tailwind'

type Props = {
  className?: string
  textToShow?: string
  collapsedText?: string
}

const About = (props: Props) => {
  const { className, textToShow, collapsedText } = props

  return (
    <div className={cn(className)}>
      <h2 className="text-2xl font-bold">About</h2>
      <div className="my-2" />
      <CollapsibleText
        renderTextToShow={() => <p>{textToShow}</p>}
        renderCollapsedText={() => <p className="mb-4">{collapsedText}</p>}
        renderShowMoreText={() => <p>Show More</p>}
      />
    </div>
  )
}

export default About
