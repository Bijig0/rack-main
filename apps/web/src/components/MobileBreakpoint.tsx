type Props = {
  children: React.ReactNode
}

const MobileBreakpoint = (props: Props) => {
  const { children } = props
  return <div className="block lg:hidden">{children}</div>
}

export default MobileBreakpoint
