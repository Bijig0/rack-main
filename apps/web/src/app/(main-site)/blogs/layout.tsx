type Props = {
  children: React.ReactNode
}

const Layout = (props: Props) => {
  const { children } = props
  return <div className="mx-auto w-full max-w-3xl">{children}</div>
}
export default Layout
