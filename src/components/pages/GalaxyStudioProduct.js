'use client';

import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ProductS26Ultra from '@/components/ProductS26Ultra';
import ProductS26Plus from '@/components/ProductS26Plus';
import ProductS26 from '@/components/ProductS26';
import ProtectedPage from '@/components/ProtectedPage';

export default function GalaxyStudioHome({mallId}) {
  const sectionRef = useRef(null);
  const [hideButton, setHideButton] = useState(false);

  const handleScroll = () => {
    if (!sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const isVisible = rect.top <= window.innerHeight / 2;

    if (isVisible) {
      setHideButton(true);
    }
  };

  const scrollToSection = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
      setHideButton(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    AOS.init({ once: true, duration: 800 });
  }, []);

  return (
    <ProtectedPage>
    <div className="bg-gray-100 py-0">
      {!hideButton && (
        <div className="fixed left-0 right-0 bottom-[6rem] mx-auto flex items-center justify-center z-50">
          <button
            onClick={scrollToSection}
            className="inline-flex items-center px-5 py-3 bg-white rounded-full shadow-xl"
          >
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

      {/* Booth Image */}
      {/* <div className="my-4 mt-[-2.5rem] relative" data-aos="fade-up"> */}

      <div className="my-4 mt-0 relative" data-aos="fade-up">
        {mallId === "MallKelapaGading4" ? (
          <Image
            src="/images/bloom/product-mkg.png"
            alt="Galaxy Studio Booth"
            width={360}
            height={509}
            className="w-full mx-auto"
          />
          ) : (
            <Image
              src="/images/bloom/product-gi.png"
              alt="Galaxy Studio Booth"
              width={360}
              height={509}
              className="w-full mx-auto"
            />
        )}
      </div>
      <div ref={sectionRef} className='pt-0'>
        <ProductS26Ultra />
        <ProductS26Plus />
        <ProductS26 />
      </div>

    </div>
    </ProtectedPage>
  );
}
