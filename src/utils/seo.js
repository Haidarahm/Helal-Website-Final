/**
 * SEO utility functions for managing meta tags, titles, and structured data
 */

const SITE_URL = "https://he779.com";
const SITE_NAME = "Helal Al Jabri - Trainer & Investment Expert";
const DEFAULT_IMAGE = "/logo.png";

/**
 * Sets the document title
 */
export const setTitle = (title) => {
  document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
};

/**
 * Creates or updates a meta tag
 */
const setMetaTag = (property, content, isProperty = false) => {
  if (!content) return;

  const attribute = isProperty ? "property" : "name";
  let tag = document.querySelector(`meta[${attribute}="${property}"]`);

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, property);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
};

/**
 * Removes a meta tag
 */
const removeMetaTag = (property, isProperty = false) => {
  const attribute = isProperty ? "property" : "name";
  const tag = document.querySelector(`meta[${attribute}="${property}"]`);
  if (tag) {
    tag.remove();
  }
};

/**
 * Sets meta description
 */
export const setDescription = (description) => {
  setMetaTag("description", description);
  setMetaTag("og:description", description, true);
  setMetaTag("twitter:description", description);
};

/**
 * Sets Open Graph and Twitter Card tags
 */
export const setSocialMeta = ({ title, description, image, url, type = "website" }) => {
  // Open Graph
  setMetaTag("og:title", title || document.title, true);
  setMetaTag("og:description", description, true);
  setMetaTag("og:image", image || `${SITE_URL}${DEFAULT_IMAGE}`, true);
  setMetaTag("og:url", url || window.location.href, true);
  setMetaTag("og:type", type, true);
  setMetaTag("og:site_name", SITE_NAME, true);

  // Twitter Card
  setMetaTag("twitter:card", "summary_large_image");
  setMetaTag("twitter:title", title || document.title);
  setMetaTag("twitter:description", description);
  setMetaTag("twitter:image", image || `${SITE_URL}${DEFAULT_IMAGE}`);
};

/**
 * Sets canonical URL
 */
export const setCanonical = (url) => {
  let canonical = document.querySelector("link[rel='canonical']");
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", url || window.location.href);
};

/**
 * Sets language attribute
 */
export const setLanguage = (lang) => {
  document.documentElement.lang = lang || "en";
};

/**
 * Adds structured data (JSON-LD)
 */
export const setStructuredData = (data) => {
  // Remove existing structured data script
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  if (!data) return;

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

/**
 * Main SEO function to set all meta tags
 */
export const setSEO = ({
  title,
  description,
  image,
  url,
  type = "website",
  lang = "en",
  structuredData,
}) => {
  // Set title
  setTitle(title);

  // Set description
  if (description) {
    setDescription(description);
  }

  // Set social meta tags
  setSocialMeta({ title, description, image, url, type });

  // Set canonical URL
  setCanonical(url);

  // Set language
  setLanguage(lang);

  // Set structured data
  if (structuredData) {
    setStructuredData(structuredData);
  }
};

/**
 * Cleans up meta tags (useful when navigating)
 */
export const cleanupSEO = () => {
  // Remove Open Graph tags
  const ogTags = ["og:title", "og:description", "og:image", "og:url", "og:type", "og:site_name"];
  ogTags.forEach((tag) => removeMetaTag(tag, true));

  // Remove Twitter Card tags
  const twitterTags = ["twitter:card", "twitter:title", "twitter:description", "twitter:image"];
  twitterTags.forEach((tag) => removeMetaTag(tag));

  // Remove structured data
  const structuredDataScript = document.querySelector('script[type="application/ld+json"]');
  if (structuredDataScript) {
    structuredDataScript.remove();
  }
};



