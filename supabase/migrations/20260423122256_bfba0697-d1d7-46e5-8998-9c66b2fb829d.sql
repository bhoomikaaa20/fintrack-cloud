CREATE OR REPLACE FUNCTION public.set_txn_status()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.status = CASE WHEN NEW.amount > 50000 THEN 'high'::public.txn_status ELSE 'normal'::public.txn_status END;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP POLICY IF EXISTS "Anyone view receipts" ON storage.objects;
CREATE POLICY "Owners and admins view receipts" ON storage.objects FOR SELECT
  USING (
    bucket_id = 'receipts' AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR public.has_role(auth.uid(), 'admin')
    )
  );