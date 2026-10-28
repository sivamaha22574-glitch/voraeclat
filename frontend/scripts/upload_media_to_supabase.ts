import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://ntruvmlzfyouxyasfivn.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_tE8KL6ALP04iKUjBe8mzuw_JDWoI9VL';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function uploadPublicAssets() {
  const publicDir = path.resolve(process.cwd(), 'public');
  const files = fs.readdirSync(publicDir);

  console.log(`Found ${files.length} assets in public/ to migrate to Supabase Storage:`);

  for (const file of files) {
    const filePath = path.join(publicDir, file);
    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      const buffer = fs.readFileSync(filePath);
      const ext = path.extname(file).toLowerCase();
      let contentType = 'application/octet-stream';
      if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      else if (ext === '.png') contentType = 'image/png';
      else if (ext === '.webp') contentType = 'image/webp';
      else if (ext === '.svg') contentType = 'image/svg+xml';
      else if (ext === '.mp4') contentType = 'video/mp4';

      console.log(`Uploading ${file} (${stat.size} bytes) to storage bucket puppy_media...`);
      const { data, error } = await supabase.storage.from('puppy_media').upload(file, buffer, {
        contentType,
        upsert: true,
      });

      if (error) {
        console.error(`Failed to upload ${file}:`, error.message);
      } else {
        const { data: publicUrlData } = supabase.storage.from('puppy_media').getPublicUrl(file);
        console.log(`Uploaded ${file} -> Public URL: ${publicUrlData.publicUrl}`);

        // If it's hero-stylish-kids.jpg, update the puppy_banners and puppy_ad_campaigns that reference it!
        if (file === 'hero-stylish-kids.jpg') {
          console.log('Updating puppy_banners and puppy_ad_campaigns with public Supabase Storage URL...');
          await supabase
            .from('puppy_banners')
            .update({ image_url: publicUrlData.publicUrl })
            .ilike('image_url', '%hero-stylish-kids.jpg%');

          await supabase
            .from('puppy_ad_campaigns')
            .update({ image_url: publicUrlData.publicUrl })
            .ilike('image_url', '%hero-stylish-kids.jpg%');
        }
      }
    }
  }
}

uploadPublicAssets()
  .then(() => console.log('Asset migration completed!'))
  .catch((e) => console.error(e));
