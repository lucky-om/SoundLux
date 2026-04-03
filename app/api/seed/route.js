import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { PRODUCTS } from '@/lib/data';

export async function GET() {
  try {
    console.log("Seeding Database with Products...");
    // 1. Delete all existing products just in case to prevent duplicates
    await supabase.from('products').delete().neq('id', 0);
    
    // 2. Insert PRODUCTS array
    const { data, error } = await supabase.from('products').insert(
      PRODUCTS.map(p => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        tagline: p.tagline,
        description: p.description,
        price: p.price,
        original_price: p.originalPrice,
        category_id: p.categoryId,
        image_url: p.image,
        images: p.images,
        specs: p.specs,
        stock: p.stock,
        rating: p.rating,
        review_count: p.reviewCount,
        is_featured: p.isFeatured,
        badge: p.badge
      }))
    );
    
    if (error) throw error;
    
    return NextResponse.json({ success: true, message: `Inserted ${PRODUCTS.length} products.`});
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
