import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cwnhcevzdnvfjrgvkkel.supabase.co'
const supabaseKey = 'sb_publishable_VsKyEF6BTxf8NPaJGbN0Lw_ED6tubY6'

export const supabase = createClient(supabaseUrl, supabaseKey)