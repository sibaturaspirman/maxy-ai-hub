"use client";

import PromoCard from "./PromoCard";

const promosByMall = {
  "MallKelapaGading4": [
    {
      label: "Special Offer",
      title: "Total Bonus",
      description: "Dapatkan total bonus hingga Rp.9.048 Juta",
      image: "/images/bloom/promo-1.png",
    },
    {
      label: "Special Offer",
      title: "Memory Upgrade",
      description: "Gratis Memory Upgrade hingga senilai 4.5juta",
      image: "/images/n-promo-2.png",
    },
    {
      label: "Cashback",
      title: "Cashback Bank",
      description: "Dapatkan bank cashback hingga Rp2 juta",
      image: "/images/bloom/promo-1.png",
    },
    {
      label: "Special Offer",
      title: "Trade-in",
      description: "Dapatkan cashback trade-in hingga 1juta",
      image: "/images/bloom/promo-1.png",
    },
    {
      label: "Special Offer",
      title: "Trade in Plus",
      description: "Dapatkan casback bank hingga Rp.500rb khusus MyEraspace Member",
      image: "/images/m-promo-3.png",
    },
    {
      label: "Special Offer",
      title: "Tumbler Exclusive",
      description: "Dapatkan tumbler Chako lab khusus untuk MyEraspace Member",
      image: "/images/bloom/promo-2.png",
    },
    {
      label: "Special Offer",
      title: "Accessories",
      description: "Dapatkan Clear Case + Travel Adapter 25W",
      image: "/images/bloom/promo-3.png",
    },
    {
      label: "Special Offer",
      title: "Cicilan 0%",
      description: "Cicilan 0% s.d 24 bulan dengan beberapa kartu kredit",
      image: "/images/bloom/promo-4.png",
    },
  ],
  default: [
    {
      label: "Special Offer",
      title: "Total Bonus",
      description: "Dapatkan total bonus hingga Rp 8,3 Juta",
      image: "/images/bloom/promo-1.png",
    },
    {
      label: "Special Offer",
      title: "Memory Upgrade",
      description: "Gratis Memory Upgrade hingga senilai 4.5juta",
      image: "/images/n-promo-2.png",
    },
    {
      label: "Special Offer",
      title: "Additional Bonus",
      description: "Dapatkan tambahan bonus voucher di Blibli hingga Rp1 juta",
      image: "/images/bloom/n-promo-blibli.png",
    },
    {
      label: "Special Offer",
      title: "Voucher",
      description: "Dapatkan voucher tiket.com hingga Rp200 ribu",
      image: "/images/bloom/n-promo-emoney.png",
    },
    {
      label: "Special Offer",
      title: "Flazz Card Exclusive",
      description: "Dapatkan BCA Flazz Card Executive Blibli",
      image: "/images/bloom/n-promo-flazz.png",
    },
    {
      label: "Special Offer",
      title: "Tumbler Exclusive",
      description: "Dapatkan tumbler Stanley khusus 15 orang pertama",
      image: "/images/bloom/promo-2.png",
    },
    {
      label: "Special Offer",
      title: "Accessories",
      description: "Dapatkan Travel adapter 25W",
      image: "/images/bloom/promo-3.png",
    },
    {
      label: "Special Offer",
      title: "Cicilan 0%",
      description: "Cicilan 0% s.d 24 bulan dengan beberapa kartu kredit",
      image: "/images/bloom/promo-4.png",
    },
  ],
};

export default function PromoList({ mallId }) {
  const promos = promosByMall[mallId] || promosByMall["default"];

  return (
    <section className="mt-10" data-aos="fade-up">
      <h3 className="font-semibold text-lg mb-3">Promo dan penawaran</h3>
      {promos.map((item, index) => (
        <PromoCard
          key={index}
          label={item.label}
          title={item.title}
          description={item.description}
          image={item.image}
        />
      ))}
    </section>
  );
}
