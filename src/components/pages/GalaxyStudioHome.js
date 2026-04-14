"use client";

import Image from "next/image";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import GalaxyStudioSchedule from "@/components/GalaxyStudioSchedule";
import PromoList from "@/components/PromoList";
import KeyVisual from "@/components/KeyVisual";
import ProtectedPage from "@/components/ProtectedPage";

export default function GalaxyStudioHome({ profile, mallId }) {
  useEffect(() => {
    AOS.init({ once: true, duration: 800 });
  }, []);

  return (
    <ProtectedPage>
      <div className="bg-gray-100 py-0">
        <div className=" px-4">
          {/* Headline */}
          <div className="text-center" data-aos="fade-up">
            <p className="text-base opacity-[.75]">Selamat datang</p>
            {/* <h2 className="text-2xl font-bold mt-1">Galaxy Studio</h2>
                <h1 className="text-[32px] font-bold leading-snug mt-2">
                Unfold power.<br />Flip the norm.
                </h1> */}
            <div className="relative w-full">
              <Image
                src="/images/bloom/logo.png"
                alt="Galaxy Studio Booth"
                width={320}
                height={80}
                className="w-full mx-auto"
              />
            </div>
          </div>
        </div>

        {/* Booth Image */}
        <div className="my-4 mb-0 relative" data-aos="fade-up">
          {mallId === "MallKelapaGading4" ? (
          <Image
            src="/images/bloom/studiomkg.png"
            alt="Galaxy Studio Booth"
            width={360}
            height={220}
            className="w-full mx-auto"
          />
          ) : (
            <Image
              src="/images/bloom/studiogi.jpg"
              alt="Galaxy Studio Booth"
              width={360}
              height={220}
              className="w-full mx-auto"
            />
          )}
        </div>
        <div className="px-4">
          {/* Description */}
          <div
            className="text-sm text-gray-700 mt-4 leading-relaxed"
            data-aos="fade-up"
          >
            {/* Rasakan pengalaman <br/> menggunakan Galaxy Z Fold7 | Z Flip7.<br />
            Jelajahi area-area yang telah kami siapkan dan rasakan langsung inovasi, desain, serta
            kecanggihan yang ditawarkan oleh <br/> Galaxy Foldables terbaru ini. */}
           Rasakan pengalaman menggunakan Google Gemini melalui Galaxy S26 Series. Jelajahi area-area yang telah kami siapkan dan dapatkan hadiah
          </div>

          <GalaxyStudioSchedule />
          <PromoList mallId={mallId} />
        </div>

        <KeyVisual mallId={mallId} />
      </div>
    </ProtectedPage>
  );
}
