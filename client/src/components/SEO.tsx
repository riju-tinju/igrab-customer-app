import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
    canonical?: string;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords,
    ogImage,
    canonical
}) => {
    const siteTitle = "iGrab Story Cafe";
    const defaultDescription = "Premium coffee, sweets, and snacks delivered to your door. Experience the taste of iGrab.";
    const defaultKeywords = ["coffee", "sweets", "cafe", "iGrab", "delivery"];
    const defaultOgImage = "/og-image.png";

    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const metaDescription = description || defaultDescription;
    const metaKeywords = keywords ? keywords.join(', ') : defaultKeywords.join(', ');
    const metaOgImage = ogImage || defaultOgImage;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metaKeywords} />

            {/* Open Graph Tags */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:type" content="website" />
            <meta property="og:image" content={metaOgImage} />

            {/* Canonical URL */}
            {canonical && <link rel="canonical" href={canonical} />}

            {/* RTL Support - though this is usually handled by a context, keeping it here for completeness if needed */}
            <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        </Helmet>
    );
};

export default SEO;
