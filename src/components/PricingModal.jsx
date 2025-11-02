import { Modal } from "antd";
import { Briefcase, Building2, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/LanguageContext";
import { useState } from "react";

export default function PricingModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { isRTL, currentLanguage } = useLanguage();

  const [selectedService, setSelectedService] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const iconMap = {
    0: Users,
    1: Building2,
    2: Briefcase,
  };

  // Fake data for pricing plans with translations
  const plansEn = [
    {
      category: "Small Institutes & Organizations",
      items: [
        {
          title: "General / Specialized Consultation (1 Hour)",
          price: "1,000 AED",
          desc: "Receive expert advice tailored to your needs for personal or organizational growth.",
        },
        {
          title: "One-Hour Training Workshop",
          price: "3,500 AED",
          desc: "A focused, practical session delivering actionable skills and insights.",
        },
        {
          title: "One-Day Training Workshop",
          price: "5,000 AED",
          desc: "Comprehensive one-day workshop to build and refine essential professional skills.",
        },
        {
          title: "One-Day Training Course",
          price: "8,000 AED",
          desc: "A full-day intensive course designed for measurable development outcomes.",
        },
      ],
    },
    {
      category: "Medium Companies",
      items: [
        {
          title: "Full Training Program (1 Week)",
          price: "20,000 AED",
          desc: "An in-depth, week-long training experience designed for organizational improvement.",
        },
      ],
    },
    {
      category: "Large Companies",
      items: [
        {
          title: "Full Training Program (1 Day)",
          price: "40,000 AED",
          desc: "A premium corporate training session focused on leadership, strategy, and performance.",
        },
      ],
    },
  ];

  const plansAr = [
    {
      category: "المؤسسات والمنظمات الصغيرة",
      items: [
        {
          title: "استشارة عامة / متخصصة (ساعة واحدة)",
          price: "1,000 درهم",
          desc: "احصل على استشارة خبيرة مصممة وفقًا لاحتياجاتك للنمو الشخصي أو المؤسسي.",
        },
        {
          title: "ورشة تدريبية لمدة ساعة",
          price: "3,500 درهم",
          desc: "جلسة عملية مركزة تقدم مهارات ورؤى قابلة للتطبيق.",
        },
        {
          title: "ورشة تدريبية ليوم واحد",
          price: "5,000 درهم",
          desc: "ورشة شاملة ليوم واحد لتطوير وصقل المهارات المهنية الأساسية.",
        },
        {
          title: "دورة تدريبية ليوم واحد",
          price: "8,000 درهم",
          desc: "دورة مكثفة ليوم كامل مصممة لتحقيق نتائج تطوير قابلة للقياس.",
        },
      ],
    },
    {
      category: "الشركات المتوسطة",
      items: [
        {
          title: "برنامج تدريبي كامل (أسبوع واحد)",
          price: "20,000 درهم",
          desc: "تجربة تدريبية متعمقة لمدة أسبوع مصممة لتحسين الأداء المؤسسي.",
        },
      ],
    },
    {
      category: "الشركات الكبيرة",
      items: [
        {
          title: "برنامج تدريبي كامل (يوم واحد)",
          price: "40,000 درهم",
          desc: "جلسة تدريبية متميزة تركز على القيادة والاستراتيجية والأداء.",
        },
      ],
    },
  ];

  const plans = currentLanguage === "ar" ? plansAr : plansEn;

  const handleSubscribe = (service) => {
    // Convert service data to match backend format
    const serviceData = {
      id: service.id || `${service.title.toLowerCase().replace(/\s+/g, "_")}`,
      title: service.title,
      price:
        typeof service.price === "string"
          ? parseFloat(service.price.replace(/[^\d]/g, ""))
          : parseFloat(service.price || 0),
      currency: "AED",
      description: service.desc,
    };

    setSelectedService(serviceData);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (paymentData) => {
    console.log("Payment successful:", paymentData);
    setIsPaymentModalOpen(false);
    setSelectedService(null);

    // Show success message
    alert("Payment successful! You will receive a confirmation email shortly.");
  };

  const handlePaymentCancel = () => {
    setIsPaymentModalOpen(false);
    setSelectedService(null);
  };

  return (
    <>
      <Modal
        title={
          <div className="text-center py-4">
            <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold text-primary mb-3 ">
              {currentLanguage === "ar" ? "الأسعار" : "Pricing"}
            </h1>
            <p className="text-text-light text-base xl:text-lg 2xl:text-xl max-w-2xl mx-auto leading-relaxed">
              {currentLanguage === "ar"
                ? "استكشف باقات تدريب مرنة مصممة للمعاهد والشركات والأفراد — بهدف تحقيق أعلى قيمة ونمو."
                : "Explore flexible training packages tailored for institutes, companies, and individuals — designed to maximize value and growth."}
            </p>
          </div>
        }
        open={isOpen}
        onCancel={onClose}
        footer={null}
        width="90%"
        style={{ maxWidth: "1200px" }}
        className="pricing-modal"
        styles={{
          body: {
            backgroundColor: "var(--color-secondary)",
            color: "var(--color-accent)",
            padding: "24px",
          },
          header: {
            backgroundColor: "var(--color-secondary)",
            borderBottom: "1px solid var(--color-secondary-light)",
          },
        }}
      >
        <div className="space-y-8">
          {plans.map((plan, i) => {
            const Icon = iconMap[i] || Users;
            return (
              <div key={i} className="space-y-6">
                {/* Category Header */}
                <div
                  className={`flex items-center justify-center mb-8 ${
                    isRTL ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div className="flex items-center category-badge px-6 py-3 rounded-full">
                    <Icon
                      className={`w-6 h-6 text-primary ${
                        isRTL ? "ml-3" : "mr-3"
                      }`}
                    />
                    <h2 className="text-xl xl:text-2xl 2xl:text-3xl font-bold text-primary">
                      {plan.category}
                    </h2>
                  </div>
                </div>

                {/* Pricing Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {plan.items.map((item, j) => (
                    <div
                      key={j}
                      className="group bg-secondary-light rounded-xl p-6 transition-all duration-200 hover:bg-secondary-light/80 hover:shadow-md"
                    >
                      {/* Price */}
                      <div
                        className={`flex justify-between items-center mb-3 ${
                          isRTL ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <h3
                          className={`text-xl font-bold text-primary ${
                            isRTL ? "text-right" : "text-left"
                          }`}
                        >
                          {item.price}
                        </h3>
                      </div>

                      {/* Title */}
                      <h4
                        className={`text-base font-semibold text-accent mb-2 leading-tight ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {item.title}
                      </h4>

                      {/* Description */}
                      <p
                        className={`text-text-secondary text-sm leading-relaxed mb-4 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {item.desc}
                      </p>

                      {/* Button */}
                      <button
                        onClick={() => handleSubscribe(item)}
                        className="w-full bg-primary hover:bg-primary-dark text-accent font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200"
                      >
                        {currentLanguage === "ar" ? "اشترك" : "Subscribe"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
    </>
  );
}
