import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { setSEO, cleanupSEO } from "../utils/seo";
import { useLanguage } from "../context/LanguageContext";

/**
 * SEO Component - Sets meta tags, Open Graph, Twitter Cards, and structured data
 *
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.image - OG image URL
 * @param {string} props.type - OG type (website, article, etc.)
 * @param {Object} props.structuredData - JSON-LD structured data
 */
export default function SEO({
  title,
  description,
  image,
  type,
  structuredData,
}) {
  const location = useLocation();
  const { currentLanguage } = useLanguage();
  const SITE_URL = "https://he779.com";

  useEffect(() => {
    const url = `${SITE_URL}${location.pathname}`;

    // Handle image URL - check if it's already a full URL
    let imageUrl = image;
    if (image && !image.startsWith("http")) {
      imageUrl = image.startsWith("/")
        ? `${SITE_URL}${image}`
        : `${SITE_URL}/${image}`;
    }

    // Set SEO tags
    setSEO({
      title,
      description,
      image: imageUrl,
      url,
      type: type || "website",
      lang: currentLanguage || "en",
      structuredData,
    });

    // Cleanup on unmount
    return () => {
      cleanupSEO();
    };
  }, [
    title,
    description,
    image,
    type,
    structuredData,
    location.pathname,
    currentLanguage,
  ]);

  return null;
}
