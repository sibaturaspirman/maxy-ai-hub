'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const productData = {
  name: 'Galaxy S26+',
  colors: [
    {
      name: 'Black',
      value: '#4A4E60',
      images: [
        '/images/bloom/S26Ultra/Type=S26+-Warna=Black-Slide=1.png',
        '/images/bloom/S26Ultra/Type=S26+-Warna=Black-Slide=2.png',
        '/images/bloom/S26Ultra/Type=S26+-Warna=Black-Slide=3.png',
        '/images/bloom/S26Ultra/Type=S26+-Warna=Black-Slide=4.png'
      ],
    },
    {
      name: 'Cobalt Violet',
      value: '#8683DE',
      images: [
        '/images/bloom/S26Ultra/Type=S26+-Warna=Cobalt-Violet-(Hero)-Slide=1.png',
        '/images/bloom/S26Ultra/Type=S26+-Warna=Cobalt-Violet-(Hero)-Slide=2.png',
        '/images/bloom/S26Ultra/Type=S26+-Warna=Cobalt-Violet-(Hero)-Slide=3.png',
        '/images/bloom/S26Ultra/Type=S26+-Warna=Cobalt-Violet-(Hero)-Slide=4.png'
      ],
    },
    {
      name: 'Pink Gold',
      value: '#ECDCD1',
      images: [
        '/images/bloom/S26Ultra/Type=S26+-Warna=Pink-Gold-Slide=1.png',
        '/images/bloom/S26Ultra/Type=S26+-Warna=Pink-Gold-Slide=2.png',
        '/images/bloom/S26Ultra/Type=S26+-Warna=Pink-Gold-Slide=3.png',
        '/images/bloom/S26Ultra/Type=S26+-Warna=Pink-Gold-Slide=4.png'
      ],
    },
    {
      name: 'Silver Shadow',
      value: '#BBBCBD',
      images: [
        '/images/bloom/S26Ultra/Type=S26+-Warna=Silver-Shadow-Slide=1.png',
        '/images/bloom/S26Ultra/Type=S26+-Warna=Silver-Shadow-Slide=2.png',
        '/images/bloom/S26Ultra/Type=S26+-Warna=Silver-Shadow-Slide=3.png',
        '/images/bloom/S26Ultra/Type=S26+-Warna=Silver-Shadow-Slide=4.png'
      ],
    },
    {
      name: 'Sky Blue',
      value: '#D5E2EC',
      images: [
        '/images/bloom/S26Ultra/Type=S26+-Warna=Sky-Blue-Slide=1.png',
        '/images/bloom/S26Ultra/Type=S26+-Warna=Sky-Blue-Slide=2.png',
        '/images/bloom/S26Ultra/Type=S26+-Warna=Sky-Blue-Slide=3.png',
        '/images/bloom/S26Ultra/Type=S26+-Warna=Sky-Blue-Slide=4.png'
      ],
    },
    {
      name: 'White',
      value: '#eeeeee',
      images: [
        '/images/bloom/S26Ultra/Type=S26+-Warna=White-Slide=1.png',
        '/images/bloom/S26Ultra/Type=S26+-Warna=White-Slide=2.png',
        '/images/bloom/S26Ultra/Type=S26+-Warna=White-Slide=3.png',
        '/images/bloom/S26Ultra/Type=S26+-Warna=White-Slide=4.png'
      ],
    },
  ],
};

export default function ProductS26Plus() {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const selected = productData.colors[selectedColorIndex];
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  const handleColorSelect = (index) => {
    setSelectedColorIndex(index);
    if (swiperRef.current) {
      swiperRef.current.slideTo(0);
    }
  };

  useEffect(() => {
    if (swiperRef.current && prevRef.current && nextRef.current) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;
      swiperRef.current.navigation.destroy();
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, [selectedColorIndex]);

  return (
    <div className="text-center px-4 py-10 pt-10 mt-[1rem] w-full">
      <h1 className="text-3xl font-bold mb-4">{productData.name}</h1>

      <div className="relative mb-2 max-w-xs mx-auto w-full">
        <Swiper
          className="productSwiper"
          spaceBetween={0}
          slidesPerView={1}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Navigation]}
        >
          {selected.images.map((img, index) => (
            <SwiperSlide key={index}>
              <Image
                src={img}
                alt={`${productData.name} ${selected.name}`}
                width={250}
                height={250}
                className="mx-auto"
                style={{ height: 'auto' }}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Chevron Buttons */}
        <button
          ref={prevRef}
          className="absolute left-[-20px] top-1/2 transform -translate-y-1/2 w-[40px] h-[40px] rounded-full shadow-md flex items-center justify-center z-30 navprodslider"
        >
          <Image
            src="/images/chev-l.png"
            alt="Previous"
            width={40}
            height={40}
            className="w-full mx-auto"
          />
        </button>
        <button
          ref={nextRef}
          className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 w-[40px] h-[40px] rounded-full shadow-md flex items-center justify-center z-30 navprodslider"
        >
          <Image
            src="/images/chev-r.png"
            alt="Next"
            width={40}
            height={40}
            className="w-full mx-auto"
          />
        </button>
      </div>

      <p className="text-sm font-semibold mb-1 mt-2">Warna</p>
      <div className="flex justify-center gap-3 mb-6">
        {productData.colors.map((color, index) => {
          const isSelected = selectedColorIndex === index;
          return (
            <button
              key={index}
              className={`w-8 h-8 rounded-full border-2 border-[#ccc] flex items-center justify-center  ${
                isSelected ? 'border-2 bg-[#F3F4F6] p-[2px]' : ''
              }`}
              style={isSelected ? { borderColor: '#686884' } : {}}
              onClick={() => handleColorSelect(index)}
            >
              <div
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: color.value }}
              ></div>
            </button>
          );
        })}
      </div>

      <a
        href="https://www.samsung.com/id/smartphones/galaxy-s26/"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full transition block"
      >
        <Image
          src="/images/bloom/btn-info.png"
          className="w-[80%] mx-auto"
          alt="Samsung"
          width={320}
          height={56}
          priority
        />
      </a>
    </div>
  );
}
