import MyForm from './site/MyForm'

const page = async () => {
  // const barbershopsDetails = await getBarbershopsDetails()
  return (
    <main className='min-h-screen" flex flex-col space-y-4'>
      <MyForm />
    </main>
  )
}

export default page
