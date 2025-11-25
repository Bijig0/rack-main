type Props = {
  children: React.ReactNode
}

const DesktopBreakpoint = (props: Props) => {
  const { children } = props
  return <div className="hidden lg:block">{children}</div>
}

export default DesktopBreakpoint
