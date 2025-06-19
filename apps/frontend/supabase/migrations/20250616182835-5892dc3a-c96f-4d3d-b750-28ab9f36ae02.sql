
-- Create vendors table
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  business_name TEXT NOT NULL,
  whatsapp_number TEXT,
  bank_name TEXT,
  account_number TEXT,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create collections table
CREATE TABLE public.collections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vendors
CREATE POLICY "Vendors can view their own data" 
  ON public.vendors 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Vendors can update their own data" 
  ON public.vendors 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view vendor data for public access" 
  ON public.vendors 
  FOR SELECT 
  USING (true);

-- RLS Policies for collections
CREATE POLICY "Vendors can manage their own collections" 
  ON public.collections 
  FOR ALL 
  USING (vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid()));

CREATE POLICY "Anyone can view collections for public access" 
  ON public.collections 
  FOR SELECT 
  USING (true);

-- RLS Policies for products
CREATE POLICY "Vendors can manage their own products" 
  ON public.products 
  FOR ALL 
  USING (vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid()));

CREATE POLICY "Anyone can view products for public access" 
  ON public.products 
  FOR SELECT 
  USING (true);

-- Create function to automatically create vendor profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_vendor()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.vendors (user_id, business_name, slug)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'business_name', 'My Business'),
    LOWER(REPLACE(COALESCE(NEW.raw_user_meta_data->>'business_name', 'vendor-' || NEW.id::text), ' ', '-'))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new vendors
CREATE TRIGGER on_auth_vendor_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_vendor();
