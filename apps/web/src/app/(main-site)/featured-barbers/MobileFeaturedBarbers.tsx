// import BarberCard from '@/components/BarberCard'
// import ServerSideDesktopBreakpoint from '@/components/DesktopBreakpoint'
// import ServerSideMobileBreakpoint from '@/components/MobileBreakpoint'
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from '@/components/ui/carousel'
// // import router from 'next/router'
// import Address from './Address'

// const MobileFeaturedBarbers = () => {
//   // const onBarberCardClick = () => {
//   //   router.push('/barbershops/1')
//   // }

//   return (
//     <section
//       style={{ maxWidth: '1280px' }}
//       className="px-4 py-8 mx-auto space-y-2 lg:px-32"
//     >
//       <Address />
//       <h2 className="text-3xl font-bold font-futura">Hot Barbers Near You</h2>
//       <p className="text-md text-muted-foreground">
//         View barbers other people loved!
//       </p>
//       <ServerSideMobileBreakpoint>
//         <div className="flex gap-2 overflow-auto">
//           {[0, 1, 2].map((index) => {
//             return <BarberCard />
//           })}
//         </div>
//       </ServerSideMobileBreakpoint>

//       <ServerSideDesktopBreakpoint>
//         <Carousel className="w-full">
//           <CarouselContent>
//             {Array.from({ length: 8 }).map((_, index) => (
//               <CarouselItem
//                 key={index}
//                 className="cursor-pointer group lg:basis-1/3"
//               >
//                 <BarberCard isHoverable />
//               </CarouselItem>
//             ))}
//           </CarouselContent>
//           <CarouselPrevious className="left-[-12px]" />
//           <CarouselNext className="right-[-12px]" />
//         </Carousel>
//       </ServerSideDesktopBreakpoint>
//     </section>
//   )
// }

// export default MobileFeaturedBarbers
