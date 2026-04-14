'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const productData = {
    name: 'Galaxy Z Fold7',
    colors: [
      {
        name: 'Blue',
        value: '#325b8a',
        video: '/videos/ZFold7_Blue.mp4',
        images: [
          '/videos/ZFold7_Blue-1.png',
          '/videos/ZFold7_Blue-2.png',
          '/videos/ZFold7_Blue-3.png'
        ],
      },
      {
        name: 'Jetblack',
        value: '#4a4a4d',
        video: '/videos/ZFold7_Jetblack.mp4',
        images: [
          '/videos/ZFold7_Jetblack-1.png',
          '/videos/ZFold7_Jetblack-2.png',
          '/videos/ZFold7_Jetblack-3.png'
        ],
      },
      {
        name: 'Silver',
        value: '#b0b7b9',
        video: '/videos/ZFold7_Silver.mp4',
        images: [
          '/videos/n-ZFold7_Silver-1.png',
          '/videos/n-ZFold7_Silver-2.png',
          '/videos/n-ZFold7_Silver-3.png'
        ],
      },
    ],
  };

export default function ProductFlip7() {
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
    <div className="text-center px-4 py-10 pt-10 bg-white w-full">
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
          <SwiperSlide>
            <video
              autoPlay
              muted
              loop
              playsInline
              className="mx-auto rounded-xl"
              width={250}
              height={250}
              src={selected.video}
            />
          </SwiperSlide>
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
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isSelected ? 'border-2 bg-[#F3F4F6] p-[2px]' : ''
              }`}
              style={isSelected ? { borderColor: color.value } : {}}
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
        href="https://www.samsung.com/id/smartphones/galaxy-z-fold7/buy//"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full transition block"
      >
        <Image
          src="/images/new-btn-ketauhi.png"
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
