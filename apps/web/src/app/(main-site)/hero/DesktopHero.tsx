import Search from './Search'

const DesktopHero = () => {
  return (
    <section className="h-96 w-full rounded-3xl bg-gradient-to-t from-[#ca6ce5] to-white to-90% lg:h-auto lg:py-20">
      <div className="flex flex-col items-center justify-evenly gap-16">
        <h1 className="text-center font-futura text-3xl font-bold italic text-black md:text-4xl lg:text-header lg:not-italic">
          Find your <br className="mt-1" /> perfect barber
        </h1>
        <Search />
        {/* <div
          style={{ maxWidth: '662px' }}
          className="flex items-center justify-between w-full px-8 py-6 rounded-3xl bg-fuchsia-200"
        >
          <div className="flex flex-col items-center justify-center p-2 space-y-1 cursor-pointer rounded-xl hover:bg-white">
            <FaMap size={18} />
            <p className="text-xs font-semibold">Melbourne CBD</p>
          </div>
          <div className="flex flex-col items-center justify-center p-2 space-y-1 cursor-pointer rounded-xl hover:bg-white">
            <Image className="block w-5" src={Haircut} alt="haircut" />
            <p className="text-xs font-semibold">High Taper</p>
          </div>
          <div className="flex flex-col items-center justify-center p-2 space-y-1 cursor-pointer rounded-xl hover:bg-white">
            <Image className="block w-5" src={Haircut} alt="haircut" />
            <p className="text-xs font-semibold">High Taper</p>
          </div>
          <div className="flex flex-col items-center justify-center p-2 space-y-1 cursor-pointer rounded-xl hover:bg-white">
            <Image className="block w-5" src={Haircut} alt="haircut" />
            <p className="text-xs font-semibold">High Taper</p>
          </div>
          <div className="flex flex-col items-center justify-center p-2 space-y-1 cursor-pointer rounded-xl hover:bg-white">
            <Image className="block w-5" src={Haircut} alt="haircut" />
            <p className="text-xs font-semibold">High Taper</p>
          </div>
          <div className="flex flex-col items-center justify-center p-2 space-y-1 cursor-pointer rounded-xl hover:bg-white">
            <Image className="block w-5" src={Haircut} alt="haircut" />
            <p className="text-xs font-semibold">High Taper</p>
          </div>
        </div> */}
      </div>
    </section>
  )
}

export default DesktopHero
