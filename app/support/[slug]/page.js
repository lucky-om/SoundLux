import Link from 'next/link';

export default async function SupportPage({ params }) {
  const { slug } = await params;
  
  const contentMap = {
    faq: {
      title: 'Frequently Asked Questions',
      content: 'Here you can find answers to our most commonly asked questions about SoundLux orders, premium headphones, and connectivity.',
    },
    shipping: {
      title: 'Shipping Policy',
      content: 'We offer free expedited shipping on all orders above ₹5,000. Under ₹5,000, standard shipping rates apply. Delivery typically takes 2-5 business days across India.',
    },
    returns: {
      title: '30-Day Returns',
      content: 'If you are not entirely satisfied with your purchase, you have 30 days to return the headphones in their original packaging. We process refunds within 5-7 business days.',
    },
    contact: {
      title: 'Contact Us',
      content: 'Need help? You can reach our 24/7 Audio Expert Support at support@soundlux.com or call our toll-free number at 1800-000-SOUND.',
    }
  };

  const pageData = contentMap[slug] || {
    title: 'Support Center',
    content: 'Welcome to the SoundLux Support Center. We are here to help you get the most out of your premium audio equipment.',
  };

  return (
    <>
      <div className="page-header" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h1 style={{ fontFamily: 'Orbitron, sans-serif' }}>
          Sound<span className="gradient-text">Lux</span> Support
        </h1>
        <p className="text-muted" style={{ marginTop: '0.5rem' }}>{pageData.title}</p>
      </div>

      <div className="container section-sm" style={{ maxWidth: 800 }}>
        <div className="glass neon-border" style={{ padding: '3rem', borderRadius: 'var(--radius)', background: 'var(--bg-card)' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--neon-cyan)', fontFamily: 'Orbitron, sans-serif' }}>{pageData.title}</h2>
          <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '2rem' }}>
            {pageData.content}
          </p>
          <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '2rem', flexWrap: 'wrap' }}>
            {Object.keys(contentMap).map(k => (
              <Link key={k} href={`/support/${k}`} className={`btn btn-sm ${slug === k ? 'btn-primary' : 'btn-ghost'}`}>
                {contentMap[k].title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
