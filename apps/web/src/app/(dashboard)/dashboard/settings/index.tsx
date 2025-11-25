// import { Search } from '@/components/search'
// import { Separator } from '@radix-ui/react-separator'
// import { Fa0 } from 'react-icons/fa6'
// import LayoutBody from '../layout/layout-body'
// import Layout from '../layout/layout-dashboard'
// import LayoutHeader from '../layout/layout-header'
// import { UserNav } from '../user-nav'
// import SidebarNav from './sidebar-nav'

// export default function Settings() {
//   return (
//     <Layout fadedBelow fixedHeight>
//       {/* ===== Top Heading ===== */}
//       <LayoutHeader>
//         <Search />
//         <div className="flex items-center ml-auto space-x-4">
//           <UserNav />
//         </div>
//       </LayoutHeader>

//       <LayoutBody className="flex flex-col" fixedHeight>
//         <div className="space-y-0.5">
//           <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
//             Settings
//           </h1>
//           <p className="text-muted-foreground">
//             Manage your account settings and set e-mail preferences.
//           </p>
//         </div>
//         <Separator className="my-6" />
//         <div className="flex flex-col flex-1 space-y-8 overflow-auto lg:flex-row lg:space-x-12 lg:space-y-0">
//           <aside className="sticky top-0 lg:w-1/5">
//             <SidebarNav items={sidebarNavItems} />
//           </aside>
//           <div className="w-full p-1 pr-4 lg:max-w-xl">
//             <div className="pb-16">
//               <Outlet />
//             </div>
//           </div>
//         </div>
//       </LayoutBody>
//     </Layout>
//   )
// }

// const sidebarNavItems = [
//   {
//     title: 'Profile',
//     icon: <Fa0 size={18} />,
//     href: '/settings',
//   },
// ]
