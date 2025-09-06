'use client';

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Future Engineers",
    "description": "A collaborative platform for engineering students to share and access academic resources",
    "url": "https://future-engineers.vercel.app",
    "logo": "https://future-engineers.vercel.app/images/logo.png",
    "author": {
      "@type": "Organization",
      "name": "Future Engineers"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Future Engineers",
      "logo": {
        "@type": "ImageObject",
        "url": "https://future-engineers.vercel.app/images/logo.png"
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://future-engineers.vercel.app/browse?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
      "https://github.com/ItsVikasA/Future-Engineers"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
