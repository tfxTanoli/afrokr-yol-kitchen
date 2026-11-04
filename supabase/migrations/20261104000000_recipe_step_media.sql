-- Preparation steps can carry a photo or a short video (30 s max, checked in the form).
-- Step media live in the existing recipe-images bucket under recipes/steps/ and keep its
-- access rules (public read, admin-only write). This only widens the accepted file types
-- and raises the per-file limit so short videos fit; photos stay capped at 5 MB in the app.
update storage.buckets
set file_size_limit = 26214400,  -- 25 MB
    allowed_mime_types = array[
      'image/jpeg', 'image/png', 'image/webp',
      'video/mp4', 'video/webm', 'video/quicktime'
    ]
where id = 'recipe-images';
