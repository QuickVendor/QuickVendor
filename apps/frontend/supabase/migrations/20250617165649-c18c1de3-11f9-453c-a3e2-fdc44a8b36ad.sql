
-- Create product views tracking table
CREATE TABLE public.product_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  viewer_ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transaction logs table
CREATE TABLE public.transaction_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_whatsapp TEXT,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.product_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for product_views
CREATE POLICY "Vendors can view their product views" 
  ON public.product_views 
  FOR SELECT 
  USING (vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid()));

CREATE POLICY "Anyone can insert product views" 
  ON public.product_views 
  FOR INSERT 
  WITH CHECK (true);

-- RLS Policies for transaction_logs
CREATE POLICY "Vendors can view their transactions" 
  ON public.transaction_logs 
  FOR SELECT 
  USING (vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid()));

CREATE POLICY "Vendors can manage their transactions" 
  ON public.transaction_logs 
  FOR ALL 
  USING (vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid()));

-- Create view for product analytics
CREATE VIEW public.product_analytics AS
SELECT 
  p.id,
  p.name,
  p.vendor_id,
  COUNT(pv.id) as view_count,
  COUNT(CASE WHEN pv.created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as views_last_7_days,
  COUNT(CASE WHEN pv.created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as views_last_30_days
FROM public.products p
LEFT JOIN public.product_views pv ON p.id = pv.product_id
GROUP BY p.id, p.name, p.vendor_id;

-- Create view for transaction analytics
CREATE VIEW public.transaction_analytics AS
SELECT 
  tl.vendor_id,
  COUNT(*) as total_transactions,
  COUNT(CASE WHEN tl.status = 'confirmed' THEN 1 END) as confirmed_transactions,
  SUM(CASE WHEN tl.status = 'confirmed' THEN tl.amount ELSE 0 END) as total_revenue,
  COUNT(CASE WHEN tl.created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as transactions_last_7_days,
  COUNT(CASE WHEN tl.created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as transactions_last_30_days
FROM public.transaction_logs tl
GROUP BY tl.vendor_id;
