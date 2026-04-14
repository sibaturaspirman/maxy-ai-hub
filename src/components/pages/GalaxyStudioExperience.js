"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import ProtectedPage from "@/components/ProtectedPage";
import StampArea from "@/components/StampArea";

let lokasiX = [
  {
    name: "Satu foto, banyak cerita",
    stamp: false,
  },
  {
    name: "Outfit on point, mau liburan atau kulineran? Tanya Gemini aja!",
    stamp: false,
  },
  {
    name: "Ekspresikan gaya unikmu dengan Flex angle!",
    stamp: false,
  },
  {
    name: "Experience Galaxy Watch8 kaya punya coach pribadi sendiri!",
    stamp: false,
  },
  {
    name: "Experience Galaxy Watch8 kaya punya coach pribadi sendiri!",
    stamp: false,
  },
];
export default function GalaxyStudioExperience({ profile, booth, malldata }) {
  const sectionRef = useRef(null);
  const [hideButton, setHideButton] = useState(false);
  const [infoJelajahiHide, setInfoJelajahiHide] = useState(false);
  const [infoJelajahi, setInfoJelajahi] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [claimHadiah, setClaimHadiah] = useState(false);

  const hideJelajahi = () => {
    setInfoJelajahi(false);
    setInfoJelajahiHide(true);
    // localStorage.setItem("hideJelajah")
    // onclick("ea")
  };

  useEffect(() => {
    booth.forEach((booth, index) => {
      const stamped = booth.memberStamps?.length > 0;
      if (stamped) {
        lokasiX[index].stamp = true;
      }
    });

    if (
      lokasiX[0].stamp &&
      lokasiX[1].stamp &&
      lokasiX[2].stamp &&
      lokasiX[3].stamp &&
      lokasiX[4].stamp
    ) {
      setClaimHadiah(true);
    }

    const handleScroll = () => {
      if (!sectionRef.current || hasScrolled) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const isVisible = rect.top <= window.innerHeight / 2;

      if (isVisible) {
        setHasScrolled(true); // trigger hanya 1x

        // scroll ke section
        window.scrollTo({
          top: sectionRef.current.offsetTop,
          behavior: "smooth",
        });

        setHideButton(true);

        if (!infoJelajahiHide) {
          setTimeout(() => setInfoJelajahi(true), 1250);
        }

        // ✅ Hapus listener setelah selesai auto-scroll
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasScrolled, sectionRef, claimHadiah]);

  const scrollToSection = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
      setHideButton(true);
      if (!infoJelajahiHide) {
        setTimeout(() => {
          setInfoJelajahi(true);
        }, 1250);
      }
    }
  };

  const pathname = usePathname();
  const mallId = pathname.split("/")[1]; // Ambil mallId dari URL

  useEffect(() => {
    AOS.init({ once: true, duration: 800 });
  }, []);

  return (
    <ProtectedPage>
      <div className="bg-gray-100 py-0">
        <div className="min-h-screen w-full hidden">
          <div className="px-4">
            <div className="relative w-full">
              <Image
                src="/images/bloom/logo.png"
                alt="Galaxy Studio Booth"
                width={320}
                height={80}
                className="w-full mx-auto"
              />
            </div>
            <p className="text-center text-base text-gray-700 mt-3">
              Jelajahi area-area yang telah kami siapkan <br/> dan dapatkan hadiah
            </p>
          </div>

          {/* Booth Image */}
          <div className="my-4 relative" data-aos="fade-up">
            {mallId === "MallKelapaGading4" ? (
              <Image
                src="/images/bloom/experience-mkg.png"
                alt="Galaxy Studio Booth"
                width={360}
                height={269}
                className="w-full mx-auto"
              />
            ) : (
              <Image
                src="/images/bloom/experience-gi.png"
                alt="Galaxy Studio Booth"
                width={360}
                height={269}
                className="w-full mx-auto"
              />
            )}
          </div>
        </div>

        {!hideButton && (
          <div
            onClick={scrollToSection}
            className="fixed left-0 right-0 bottom-[6rem] mx-auto flex items-center justify-center"
          >
            <button className="inline-flex items-center px-5 py-3 bg-white rounded-full shadow-xl">
              <Image
                src="/images/btn-discover.png"
                alt="Galaxy Studio Booth"
                width={118}
                height={16}
                className="w-full mx-auto"
              />
            </button>
          </div>
        )}

        {!infoJelajahiHide && (
          <div
            className={`fixed top-0 left-0 w-full h-full bg-black/80 z-[100] flex items-center justify-center transition ${
              infoJelajahi ? " opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={hideJelajahi}
          >
            <div className="w-[80%] mx-auto relative">
                <Image
                  src="/images/maxy-jelajahi.png"
                  width={320}
                  height={480}
                  alt="Zirolu"
                  className="w-full"
                  priority
                />
            </div>
          </div>
        )}

        <div ref={sectionRef} className="relative w-full pt-6">
          <StampArea
            profile={profile}
            booth={booth}
            mallData={mallId}
          ></StampArea>
        </div>
      </div>
    </ProtectedPage>
  );
}
