import { Users, Star, Handshake, Globe } from "lucide-react";
import CountUp from "../../components/CountUp";

export const Statistics = () => {
  const stats = [
    {
      icon: <Users className="w-10 h-10 text-white" />,
      value: "+7,000",
      label: "Trainees & Beneficiaries",
    },
    {
      icon: <Star className="w-10 h-10 text-white" />,
      value: "+20",
      label: "Years of Training Experience",
    },
    {
      icon: <Handshake className="w-10 h-10 text-white" />,
      value: "+147",
      label: "Success Partners",
    },
    {
      icon: <Globe className="w-10 h-10 text-white" />,
      value: "+42,000",
      label: "Followers Worldwide",
    },
  ];

  return (
    <section className="relative bg-white py-16 mt-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {stats.map((item, index) => (
          <div
            key={index}
            className="flex flex-col  items-center bg-primary text-white p-6 rounded-2xl shadow-md hover:scale-105 transition-transform duration-300"
          >
            <div className="mb-4">{item.icon}</div>
            <CountUp
              from={0}
              to={item.value}
              separator=","
              direction="up"
              duration={1}
              className="text-3xl font-bold"
            />
            <p className="mt-2 text-sm font-medium">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
