import Hero from "./Hero";
import About from "./About";
import { Statistics } from "./Statistics";
import "./home.css";
import { Story } from "./Story";
import { Adaptation } from "./Adaption";
import { Certificates } from "./Certificates";
import Contact from "../Contact";
import SEO from "../../components/SEO";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Helal Al Jabri",
    jobTitle: "Trainer & Investment Expert",
    description:
      t("about.description") ||
      "Certified trainer and investment expert empowering thousands to achieve financial growth",
    url: "https://he779.com",
    sameAs: [],
    knowsAbout: [
      "Investment",
      "Stock Trading",
      "Financial Analysis",
      "Entrepreneurship",
      "Personal Development",
      "Training",
    ],
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Professional Certification",
    },
  };

  return (
    <section className="flex flex-col w-full overflow-hidden">
      <SEO
        title={
          t("hero.title") || "Helal Al Jabri - Trainer & Investment Expert"
        }
        description={
          t("hero.description") ||
          "Certified trainer and investment expert empowering thousands to achieve financial growth through innovative training and strategic insight"
        }
        type="website"
        structuredData={structuredData}
      />
      <Hero />
      <About />
      <Statistics />
      <Story />
      <Adaptation />
      <Certificates />
      <Contact />
    </section>
  );
};

export default Home;
