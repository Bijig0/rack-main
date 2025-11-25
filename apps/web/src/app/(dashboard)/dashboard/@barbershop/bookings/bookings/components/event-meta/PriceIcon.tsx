export function PriceIcon(props: { currency: string; className?: string }) {
  const { className, currency } = props
  if (currency !== 'BTC')
    return <Icon name="credit-card" className={className} />
  return <SatSymbol className={className} />
}
