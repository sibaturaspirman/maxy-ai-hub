"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import AOS from "aos";
import "aos/dist/aos.css";
import { postStamp } from "@/lib/postStamp";

let activeStampIndex = 0;
let lokasi = [
  {
    name: "Super steady video with Horizontal Lock",
    stamp: false,
  },
  {
    name: "Editing without Editing",
    stamp: false,
  },
  {
    name: "More Light, Less Noise",
    stamp: false,
  }
];

export default function StampArea({ profile, booth, mallData }) {
  const router = useRouter();
  const [Name, setName] = useState();
  const [slideIndex, setSlideIndex] = useState(0);
  const [activeVideoIndex, setActiveSwiperIndex] = useState(0); // Indeks video aktif
  const [dataBooth, setDataBoth] = useState(booth);
  // const [dataProfile, setDataProfile] = useState(profile)
  const [boothID, setBoothID] = useState(null);
  const [lokasiID, setLokasiID] = useState(null);
  const [capturedAwal, setCapturedAwal] = useState(false);
  const [loadingStamp, setLoadingStamp] = useState(false);

  const [statusStamp, setStatusStamp] = useState(false);
  const [startStamp, setStartStamp] = useState(false);
  const [claimHadiah, setClaimHadiah] = useState(false);

  // console.log(booth)

  useEffect(() => {
    AOS.init({ once: true, duration: 800 });

    dataBooth.forEach((booth, index) => {
      const stamped = booth.memberStamps?.length > 0;
      // console.log(booth)
      if (stamped) {
        lokasi[index].stamp = true;
      }
    });

    // console.log(dataProfile)

    // if(dataProfile)

    // if (mallData == "centralparkmall") {
    //   if (lokasi[0].stamp && lokasi[1].stamp && lokasi[2].stamp) {
    //     setClaimHadiah(true);
    //   }
    // } else {
      if (
        lokasi[0].stamp &&
        lokasi[1].stamp &&
        lokasi[2].stamp
      ) {
        setClaimHadiah(true);
      }
    // }

    // console.log(lokasi)

    // console.log(lokasi)
  }, [claimHadiah]);

  //STAMP
  // let sentuhan = {};
  // const [touches, setTouches] = useState([]);
  const [topLeftX, setTopLeftX] = useState(0);
  const [topLeftY, setTopLeftY] = useState(0);
  const [topRightX, setTopRightX] = useState(0);
  const [topRightY, setTopRightY] = useState(0);
  const [xPos, setXPos] = useState(0);
  const [yPos, setYPos] = useState(0);

  // REFACTOR CANVAS
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const sentuhanRef = useRef({});
  // const [statusStamp, setStatusStamp] = useState(false);
  // const [loadingStamp, setLoadingStamp] = useState(false);
  const [errorObject, setErrorObject] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    contextRef.current = context;
  }, []);

  const drawTouches = (ctx, canvas, touchPoints) => {
    if (!ctx || !canvas) return;

    // Bersihkan canvas sebelum menggambar ulang
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    touchPoints.forEach((t) => {
      // Gambar lingkaran titik
      ctx.beginPath();
      ctx.arc(t.x, t.y, 20, 0, Math.PI * 2);
      ctx.fillStyle = "blue";
      ctx.fill();

      // Tampilkan koordinat X/Y
      ctx.font = "10px Arial";
      ctx.fillStyle = "black";
      ctx.fillText(
        `X: ${Math.round(t.x)} | Y: ${Math.round(t.y)}`,
        t.x - 30,
        t.y + 30
      );
    });
  };

  const drawCapGrid = (ctx, canvas, color) => {
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cols = 4;
    const rows = 6;
    const paddingX = 60;
    const paddingY = 60;
    const radius = 20;

    const gridWidth = canvas.width - paddingX * 2;
    const gridHeight = canvas.height - paddingY * 2;
    const cellWidth = gridWidth / (cols - 1);
    const cellHeight = gridHeight / (rows - 1);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = paddingX + col * cellWidth;
        const y = paddingY + row * cellHeight;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }
  };

  const handleTouchStart = (e) => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    const rect = canvas.getBoundingClientRect();

    sentuhanRef.current = {}; // reset data sentuhan

    // Simpan titik-titik baru
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      sentuhanRef.current[touch.identifier] = { x, y };
    }

    drawCapGrid(ctx, canvas, "gray");

    // Gambar titik-titik baru
    // const points = Object.values(sentuhanRef.current);
    // drawTouches(ctx, canvas, points);
  };

  const handleTouchMove = (e) => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    const rect = canvas.getBoundingClientRect();

    const touches = Array.from(e.touches).map((t) => ({
      x: t.clientX - rect.left,
      y: t.clientY - rect.top,
    }));

    // drawTouches(ctx, canvas, touches);
    drawCapGrid(ctx, canvas, "gray");
  };

  const checkSquarePattern = (points) => {
    if (points.length !== 2) return false;

    points.sort((a, b) => a.x - b.x || a.y - b.y);
    const [topLeft, topRight] = points;
    const thresholdXDistMin = 110;
    const thresholdXDistMax = 170;
    const thresholdYDistMin = 60;
    const thresholdYDistMax = 135;

    // const thresholdXDistMin = 130;
    // const thresholdXDistMax = 150;
    // const thresholdYDistMin = 80;
    // const thresholdYDistMax = 105;

    setTopLeftX(Math.round(topLeft.x));
    setTopLeftY(Math.round(topLeft.y));
    if (topRight != undefined) {
      setTopRightX(Math.round(topRight.x));
      setTopRightY(Math.round(topRight.y));

      setXPos(Math.round(topRight.x - topLeft.x));
      setYPos(Math.round(topLeft.y - topRight.y));
    }

    const isXPosMin = Math.round(topRight.x - topLeft.x) >= thresholdXDistMin;
    const isXPosMax = Math.round(topRight.x - topLeft.x) <= thresholdXDistMax;
    const isYPosMin = Math.round(topLeft.y - topRight.y) >= thresholdYDistMin;
    const isYPosMax = Math.round(topLeft.y - topRight.y) <= thresholdYDistMax;
    const isXRightMoreLeft = topRight.x > topLeft.x;
    const isYLeftMoreRight = topLeft.y > topRight.y;

    return (
      isXPosMin &&
      isXPosMax &&
      isYPosMin &&
      isYPosMax &&
      isXRightMoreLeft &&
      isYLeftMoreRight
    );
  };

  const handleStamp = async () => {
    setLoadingStamp(true);
    const token = localStorage.getItem("tokenDataGSE");

    try {
      const response = await postStamp(boothID, token);
      lokasi[lokasiID].stamp = true;
      setStatusStamp(true);

      //   if(lokasi[0].stamp && lokasi[1].stamp && lokasi[2].stamp && lokasi[3].stamp){
      //     setClaimHadiah(true)
      //   }

      if (mallData == "centralparkmall") {
        if (lokasi[0].stamp && lokasi[1].stamp && lokasi[2].stamp) {
          setClaimHadiah(true);
        }
      } else {
        if (
          lokasi[0].stamp &&
          lokasi[1].stamp &&
          lokasi[2].stamp
        ) {
          setClaimHadiah(true);
        }
      }

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      drawCapGrid(ctx, canvas, "green");

      // console.log(profileData)

      setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }, 3000);
    } catch (error) {
      setErrorObject(error);
    } finally {
      setLoadingStamp(false);
      sentuhanRef.current = [];
    }
  };

  const handleTouchEnd = async (e) => {
    const points = Object.values(sentuhanRef.current);

    // Debug: log dulu untuk memastikan isi points
    // console.log("Sentuhan points", points);

    const isMatch = checkSquarePattern(points);
    if (isMatch) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      drawCapGrid(ctx, canvas, "blue");

      await handleStamp();
    }
  };
  // !REFACTOR CANVAS

  const mulaiStamp = (idBooth, idLokasi) => {
    setBoothID(idBooth);
    setLokasiID(idLokasi);
    // alert(idBooth)
    setCapturedAwal(true);
  };

  const backStamp = () => {
    setBoothID(null);
    setLokasiID(null);
    setCapturedAwal(false);
    setStatusStamp(false);
    setLoadingStamp(false);
  };
  //STAMP

  return (
    <main
      className="flex bg-[#F4F4F4] overflow-y-auto overflow-hidden flex-col items-center pt-2 pb-5 px-5 lg:pt-12"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center flex-col ${
          capturedAwal
            ? "z-[105] pointer-events-nonex"
            : "z-[105] pointer-events-none opacity-0"
        }`}
      >
        {/* <button onClick={handleStamp}>STAMP DISINI</button>
                {loadingStamp ? (
                <p className="text-center py-3">Mengirim data...</p>
                ) : (
                <p>-</p>
                )} */}

        <div className="absolute z-[50] mt-[-5rem] pointer-events-none">
          {/* <button onClick={handleStamp} className='p-4 px-6 rounded-lg bg-[#fff]'>STAMP DISINI</button> */}

          {!statusStamp && (
            <div className={`relative w-[250px]`}>
              <Image
                src={"/images/n-stamp-here.png"}
                width={176}
                height={176}
                alt="Zirolu"
                className="w-full"
                priority
                onClick={handleStamp}
              />
            </div>
          )}

          {statusStamp && (
            <div
              className={`relative w-[250px] ${
                loadingStamp ? "opacity-0" : ""
              }`}
            >
              <Image
                src={"/images/bloom/stamp-check2.png"}
                width={176}
                height={176}
                alt="Zirolu"
                className="w-full"
                priority
              />
              <p className="text-center py-3 text-[#fff]">Stamp berhasil!</p>
            </div>
          )}

          {loadingStamp ? (
            <p className="text-center py-3 text-[#fff]">
              Validasi stamp berlangsung...
            </p>
          ) : (
            <p className="text-center py-3 text-[#fff] opacity-0">Validasi</p>
          )}

          <div className="text-center py-3 opacity-0">
            {errorObject && (
              <pre className="mt-4 p-3 bg-gray-100 text-sm rounded border overflow-x-auto">
                {JSON.stringify(errorObject, null, 2)}
              </pre>
            )}
          </div>
        </div>

        {claimHadiah && (
          <Link
            href={"/" + mallData + "/experience/spin"}
            className={`absolute bottom-[2rem] w-[max-content] pointer-events-nonex z-[45] ${
              profile?.samsungPrize != null ? "hidden" : ""
            }`}
          >
            {" "}
            <Image
              src={"/images/bloom/btn-claim.png"}
              width={295}
              height={56}
              alt="Zirolu"
              className="w-full"
              priority
            />
          </Link>
        )}

        {!claimHadiah && (
          <button
            onClick={backStamp}
            className={`absolute bottom-[2rem] w-[max-content] pointer-events-nonex left-0 right-0 inline-block mx-auto text-center px-8 py-3 text-base font-bold bg-[#2A2A5C] rounded-full text-[#fff] z-[45] ${
              loadingStamp ? "opacity-0" : ""
            }`}
          >
            Kembali Jelajahi
          </button>
        )}
        <canvas
          ref={canvasRef}
          className={`relative z-40'`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>

      {/* PILIH STYLE */}
      <div className={`relative w-[94%] mx-auto mt-2 z-20`} data-aos="fade-up">
        {/* <div className='w-[50%] mx-auto'>
                    <Image src='/images/samsung-logo2.png' width={175} height={41} alt='Zirolu' className='w-full' priority />
                </div> */}
        <p className={`text-sm font-bold mt-1 text-center text-[#000000]`}>
          Hi, {profile?.name || "Pengunjung"}!
        </p>
        <div className="relative w-full mt-0 p-1 px-0 pt-2">
          {/* {dataBooth.map((item, index) => (
                                <p>{item.name}</p>
                    ))} */}

          <Swiper
            modules={[Pagination]}
            pagination={{
              clickable: true,
            }}
            className="mySwiper"
            grabCursor={true}
            spaceBetween={15}
            onSlideChange={(swiper) => {
              setSlideIndex(swiper.activeIndex);
              setActiveSwiperIndex(swiper.activeIndex);
              activeStampIndex = swiper.activeIndex;
            }}
            // onSwiper={(swiper) => console.log(swiper)}
          >
            {dataBooth.map((item, index) => (
              <SwiperSlide
                key={"slider-" + index}
                className={`${
                  mallData == "centralparkmall" && index == 3 ? "!hidden" : ""
                }`}
              >
                <p className="text-center text-base font-bold mb-3 px-5">
                  {lokasi[index].name}
                </p>

                {claimHadiah && (
                  <div
                    className={`mx-auto  mb-2 w-[60%] ${
                      profile?.samsungPrize != null ? "hidden" : ""
                    }`}
                  >
                    <Link
                      href={"/" + mallData + "/experience/spin"}
                      className={`relative w-full blockpointer-events-nonex`}
                    >
                      {" "}
                      <Image
                        src={"/images/bloom/btn-claim.png"}
                        width={295}
                        height={56}
                        alt="Zirolu"
                        className="w-full"
                        priority
                      />
                    </Link>
                  </div>
                )}

                <div className="relative mx-auto w-full flex justify-center items-center flex-col">
                  {mallData === "MallKelapaGading4" ? (
                    <Image
                      src={`/images/bloom/box-mkg-${index + 1}.png`}
                      width={317}
                      height={422}
                      alt="Zirolu"
                      className="w-full"
                      priority
                    />
                  ) : (
                    <Image
                      src={`/images/bloom/box-kokas-${index + 1}.png`}
                      width={317}
                      height={422}
                      alt="Zirolu"
                      className="w-full"
                      priority
                    />
                  )}

                  {/* STAMP */}
                  {/* {item.memberStamps.length == 0 && */}
                  <div
                    className={`absolute right-[1.6rem] bottom-[3rem] w-[80px] z-50 shadow-xl ${
                      capturedAwal ? "" : "hidden"
                    } ${lokasi[index].stamp ? "hidden" : ""}`}
                  >
                    <Image
                      src={"/images/samsung-stamp-here.png"}
                      width={88}
                      height={88}
                      alt="Zirolu"
                      className="w-full"
                      priority
                    />
                  </div>
                  {/* } */}

                  {/* {item.memberStamps.length == 0 && */}
                  <div
                    className={`absolute right-[1.6rem] bottom-[3rem] w-[80px] z-50 shadow-xl  animate-bgScale2 ${
                      lokasi[index].stamp ? "" : "hidden"
                    }`}
                  >
                    <Image
                      src={"/images/bloom/stamp-check.png"}
                      width={88}
                      height={88}
                      alt="Zirolu"
                      className="w-full"
                      priority
                    />
                  </div>
                  {/* } */}

                  {!lokasi[index].stamp && (
                    <div
                      className={`absolute bottom-0 left-0 right-0 pt-[5rem] pb-[4.5rem]  ${
                        capturedAwal ? "hidden" : ""
                      }`}
                      onClick={() => {
                        mulaiStamp(item.id, index);
                      }}
                    >
                      <button
                        className={`relative mx-auto w-[50%] mt-2 flex justify-center items-center animate-bgScale2`}
                      >
                        <Image
                          src="/images/samsung-tap.png"
                          width={295}
                          height={56}
                          alt="Zirolu"
                          className="w-full"
                          priority
                        />
                      </button>
                    </div>
                  )}
                  {/* !STAMP */}
                </div>

                <div className="relative w-full mt-5">
                  <Image
                    src={`/images/bloom/cara-${index + 1}.png`}
                    width={317}
                    height={422}
                    alt="Zirolu"
                    className="w-full"
                    priority
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* <p>{touches.length}</p> */}
          {/* <p className={`text-center text-base font-medium text-[#2B3B4F] mt-2`}>{slideIndex + 1} / 5</p> */}

          {/* {statusStamp && startStamp &&
                        <p className={`fixed bottom-[5rem] w-[max-content] pointer-events-none left-0 right-0 inline-block mx-auto text-center px-6 py-2 text-xs bg-[#2A2A5C] rounded-full mt-2 text-[#fff]`}>Stamp berhasil</p>
                    }

                    <div className='text-center'>
                    {!statusStamp && startStamp &&
                        <p className={`text-center text-base text-[#2B3B4F] mt-0`}></p>
                    }
                    </div> */}
        </div>
      </div>

      <div className="fixed bottom-[5rem] left-0 right-0 p-5 text-[#fff] bg-red z-[9999] pointer-events-none opacity-0">
        Top Left X : {topLeftX} | Top Left Y : {topLeftY}
        <br></br>
        Top Right X : {topRightX} | Top Right Y : {topRightY}
        <br></br>X Dist : {xPos} | Y Dist : {yPos} <br></br>
      </div>
    </main>
  );
}
