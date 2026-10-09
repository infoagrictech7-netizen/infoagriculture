/*
# Create service enquiry submissions

1. New Tables
- `service_enquiries`
- `id` (uuid, primary key)
- `full_name` (text, required)
- `phone` (text, required)
- `email` (text, optional)
- `service` (text, required)
- `farm_location` (text, required)
- `needs` (text, required)
- `created_at` (timestamptz, default now)

2. Security
- Enable row-level security on `service_enquiries`.
- Allow anonymous and authenticated visitors to submit an enquiry.
- Do not expose submitted enquiries for public reading, editing, or deletion.

3. Important Notes
- This is a single-tenant public website with no sign-in flow.
- The public form only needs INSERT access; administrative review can use a privileged server-side workflow later.
*/

CREATE TABLE IF NOT EXISTS public.service_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text NOT NULL,
  email text,
  service text NOT NULL,
  farm_location text NOT NULL,
  needs text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.service_enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can submit service enquiries" ON public.service_enquiries;
CREATE POLICY "Public can submit service enquiries"
  ON public.service_enquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(trim(full_name)) BETWEEN 2 AND 120
    AND length(trim(phone)) BETWEEN 7 AND 30
    AND (email IS NULL OR length(trim(email)) <= 254)
    AND length(trim(service)) BETWEEN 2 AND 120
    AND length(trim(farm_location)) BETWEEN 2 AND 160
    AND length(trim(needs)) BETWEEN 10 AND 2000
  );

DROP POLICY IF EXISTS "Enquiries are not publicly readable" ON public.service_enquiries;
CREATE POLICY "Enquiries are not publicly readable"
  ON public.service_enquiries FOR SELECT
  TO anon, authenticated
  USING (false);

DROP POLICY IF EXISTS "Enquiries cannot be publicly changed" ON public.service_enquiries;
CREATE POLICY "Enquiries cannot be publicly changed"
  ON public.service_enquiries FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "Enquiries cannot be publicly deleted" ON public.service_enquiries;
CREATE POLICY "Enquiries cannot be publicly deleted"
  ON public.service_enquiries FOR DELETE
  TO anon, authenticated
  USING (false);
