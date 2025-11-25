import { createBrowserClient } from './supabase/browerClient'

const uploadFile = async (file: {path: string, file: File}) => {
  const supabase = createBrowserClient()

  const { path, file: toUploadFile } = file

  const { data, error } = await supabase.storage
    .from('barbershop')
    .upload(path, toUploadFile, {
      upsert: true,
    })

  if (error) throw error

  return data
}

export default uploadFile
