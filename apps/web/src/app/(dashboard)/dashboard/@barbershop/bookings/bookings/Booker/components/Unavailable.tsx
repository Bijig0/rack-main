const UnAvailableMessage = ({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) => (
  <div className="w-full max-w-2xl mx-auto">
    <div className="p-10 overflow-hidden border rounded-lg border-subtle bg-default dark:bg-muted">
      <h2 className="mb-4 text-3xl font-cal">{title}</h2>
      {children}
    </div>
  </div>
)

export const Away = () => {
  return (
    <UnAvailableMessage title={`😴 "User away`}>
      <p className="max-w-[50ch]">{'User away description'}</p>
    </UnAvailableMessage>
  )
}

export const NotFound = () => {
  return (
    <UnAvailableMessage title={'404 page not found'}>
      <p className="max-w-[50ch]">{'Booker event not found'}</p>
    </UnAvailableMessage>
  )
}
