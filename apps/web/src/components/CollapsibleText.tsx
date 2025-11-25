'use client'
import { useCollapse } from 'react-collapsed'

type Props = {
  renderTextToShow: () => React.ReactNode
  renderCollapsedText: () => React.ReactNode
  renderShowMoreText: () => React.ReactNode
}

const CollapsibleText = (props: Props) => {
  const { renderTextToShow, renderCollapsedText, renderShowMoreText } = props
  const { getCollapseProps, getToggleProps } = useCollapse()

  return (
    <>
      {renderTextToShow()}
      <br />
      <div {...getCollapseProps()}>{renderCollapsedText()}</div>
      <div {...getToggleProps()}>{renderShowMoreText()}</div>
    </>
  )
}

export default CollapsibleText
