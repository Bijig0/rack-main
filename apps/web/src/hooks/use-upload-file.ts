// import { FileToUpload } from '@/app/barbershop-details/barbershop-gallery/BarbershopGalleryEditModeDialogBody'
// import { useToast } from '@/components/ui/use-toast'
// import uploadFiles from '@/utils/uploadFiles'
// import * as React from 'react'

// export function useUploadFile() {
//   const [uploadedFiles, setUploadedFiles] = React.useState<{ path: string }[]>(
//     [],
//   )
//   const [isUploading, setIsUploading] = React.useState(false)
//   const { toast } = useToast()

//   async function uploadThings(files: FileToUpload[]) {
//     setIsUploading(true)
//     try {
//       const res = await uploadFiles(files)

//       console.log({ res })

//       setUploadedFiles((prev) => [...prev, ...res])
//     } catch (err) {
//       if (err instanceof Error) {
//         toast({
//           variant: 'destructive',
//           title: 'Uh oh, something went wrong',
//           description: err.message,
//         })
//       }
//     } finally {
//       setIsUploading(false)
//     }
//   }

//   return {
//     uploadedFiles,
//     uploadFiles: uploadThings,
//     isUploading,
//   }
// }
