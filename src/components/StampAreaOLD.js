'use client';

import Link from 'next/link';
import Image from "next/image";
import { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import AOS from 'aos';
import 'aos/dist/aos.css';


let activeStampIndex = 0
let lokasi = [
    {
        name : 'Jelajahi setiap detail kecil lewat hasil foto 200MP yang mengagumkan',
        stamp : false,
        foto : ''
    },
    {
        name : 'Tanya rekomendasi liburan dan makanan dengan menggunakan Gemini Live with Share Screen',
        stamp : false,
        foto : ''
    },
    {
        name : 'Tanyakan rekomendasi lari mu ke coachmu menggunakan Galaxy Watch8',
        stamp : false,
        foto : ''
    },
    {
        name : 'Tanyakan rekomendasi outfit kamu menggunakan Gemini Live with Camera',
        stamp : false,
        foto : ''
    },
    {
        name : 'Tanyakan rekomendasi outfit kamu menggunakan Gemini Live with Camera',
        stamp : false,
        foto : ''
    },
]

export default function StampArea({profile}) {
    const router = useRouter();
    const [Name, setName] = useState();
    const [slideIndex, setSlideIndex] = useState(0);
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        AOS.init({ once: true, duration: 800 });
        const stored = localStorage.getItem('formData');
        if (stored) {
        try {
            const parsed = JSON.parse(stored);
            setFormData(parsed);
            // console.log('✅ Retrieved formData:', parsed);
        } catch (err) {
            console.error('❌ Error parsing formData from localStorage:', err);
        }
        }
    }, []);
    
    const [infoJelajahi, setInfoJelajahi] = useState(false);
    const [enabled, setEnabled] = useState(false);
    const [captured, setCaptured] = useState(false);
    const [capturedAwal, setCapturedAwal] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [facingMode, setFacingMode] = useState("user");
    const [statusStamp, setStatusStamp] = useState(false);
    const [startStamp, setStartStamp] = useState(false);
    // const videoRef = useRef(null);
    const previewRef = useRef(null);

    const [hasilFoto0, setHasilFoto0] = useState();
    const [hasilFoto1, setHasilFoto1] = useState();
    const [hasilFoto2, setHasilFoto2] = useState();
    const [hasilFoto3, setHasilFoto3] = useState();
    const [hasilFoto0Stamp, setHasilFoto0Stamp] = useState();
    const [hasilFoto1Stamp, setHasilFoto1Stamp] = useState();
    const [hasilFoto2Stamp, setHasilFoto2Stamp] = useState();
    const [hasilFoto3Stamp, setHasilFoto3Stamp] = useState();
    const [hasilFoto4Stamp, setHasilFoto4Stamp] = useState();


    const videoRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)]; // Referensi untuk 4 elemen video
    const canvasRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
    const [activeVideoIndex, setActiveVideoIndex] = useState(0); // Indeks video aktif
    const [stream, setStream] = useState(null);

    useEffect(() => {
        // Perform localStorage action
        if (typeof localStorage !== 'undefined') {
            const item = localStorage.getItem('dsName')
            const itemFace0 = localStorage.getItem('faceImage0')
            const itemFace1 = localStorage.getItem('faceImage1')
            const itemFace2 = localStorage.getItem('faceImage2')
            const itemFace3 = localStorage.getItem('faceImage3')
            const itemFace0Stamp = localStorage.getItem('faceImageStamp0')
            const itemFace1Stamp = localStorage.getItem('faceImageStamp1')
            const itemFace2Stamp = localStorage.getItem('faceImageStamp2')
            const itemFace3Stamp = localStorage.getItem('faceImageStamp3')
            const itemFace4Stamp = localStorage.getItem('faceImageStamp4')

            // console.log(itemFace3)

            if(itemFace0Stamp != null) lokasi[0].stamp = true
            if(itemFace1Stamp != null) lokasi[1].stamp = true
            if(itemFace2Stamp != null) lokasi[2].stamp = true
            if(itemFace3Stamp != null) lokasi[3].stamp = true
            if(itemFace4Stamp != null) lokasi[4].stamp = true

            lokasi[0].foto = itemFace0
            lokasi[1].foto = itemFace1
            lokasi[2].foto = itemFace2
            lokasi[3].foto = itemFace3

            setHasilFoto0(itemFace0)
            setHasilFoto1(itemFace1)
            setHasilFoto2(itemFace2)
            setHasilFoto3(itemFace3)

            setHasilFoto0Stamp(itemFace0Stamp)
            setHasilFoto1Stamp(itemFace1Stamp)
            setHasilFoto2Stamp(itemFace2Stamp)
            setHasilFoto3Stamp(itemFace3Stamp)
            setHasilFoto4Stamp(itemFace3Stamp)

            // console.log(lokasi)

            setName(item)
        }
    }, [Name, hasilFoto0, hasilFoto1, hasilFoto2, hasilFoto3, hasilFoto0Stamp, hasilFoto1Stamp, hasilFoto2Stamp, hasilFoto3Stamp, hasilFoto4Stamp])

    //STAMP
    let sentuhan = {};
    const [touches, setTouches] = useState([]);
    const [topLeftX, setTopLeftX] = useState(0);
    const [topLeftY, setTopLeftY] = useState(0);
    const [topRightX, setTopRightX] = useState(0);
    const [topRightY, setTopRightY] = useState(0);
    const [xPos, setXPos] = useState(0);
    const [yPos, setYPos] = useState(0);

    const canvasRef = useRef(null);


    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const handleTouchStart = (e) => {
            e.preventDefault();
            const newTouches = Array.from(e.touches).map((t) => ({
                id: t.identifier,
                x: t.pageX,
                y: t.pageY,
            }));
            sentuhan = newTouches
            setTouches(newTouches);
            setStartStamp(true)
            // drawTouches(ctx, newTouches);

            // console.log(touches.length)
            // alert(sentuhan.length)

            // alert(activeStampIndex)
            // if(sentuhan.length == 4){
            //     lokasi[activeStampIndex].stamp = true
            // }
            // setStatusStamp(true)
            // lokasi[activeStampIndex].stamp = true

            // DEBUG STAMP
            // setStatusStamp(true)
            // lokasi[activeStampIndex].stamp = true
            
            // if(activeStampIndex == 0) setHasilFoto0Stamp('true')
            // else if(activeStampIndex == 1) setHasilFoto1Stamp('true')
            // else if(activeStampIndex == 2) setHasilFoto2Stamp('true')
            // else if(activeStampIndex == 3) setHasilFoto3Stamp('true')

            // setTimeout(() => {
            //     setCapturedAwal(false)
            // }, 500);

            // if (typeof localStorage !== 'undefined') {
            //     localStorage.setItem("faceImageStamp"+activeStampIndex, true)
            // }
        };

        const handleTouchMove = (e) => {
            e.preventDefault();
            const updatedTouches = Array.from(e.touches).map((t) => ({
                id: t.identifier,
                x: t.pageX,
                y: t.pageY,
            }));
            setTouches(updatedTouches);
            // drawTouches(ctx, updatedTouches);
        };

        const handleTouchEnd = (e) => {
            e.preventDefault();
            if(lokasi[activeStampIndex].stamp){
                setCapturedAwal(false)
            }

            // console.log(sentuhan)
            if (Object.keys(sentuhan).length === 2) {
                const points = Object.values(sentuhan);
                // console.log(points)
                // console.log(checkSquarePattern(points))
                if (checkSquarePattern(points)) {
                    // alert("4 Fingers detected: Square Pattern!");
                    // console.log("4 fingers")
                    setStatusStamp(true)
                    lokasi[activeStampIndex].stamp = true
                    
                    if(activeStampIndex == 0) setHasilFoto0Stamp('true')
                    else if(activeStampIndex == 1) setHasilFoto1Stamp('true')
                    else if(activeStampIndex == 2) setHasilFoto2Stamp('true')
                    else if(activeStampIndex == 3) setHasilFoto3Stamp('true')
                    else if(activeStampIndex == 4) setHasilFoto4Stamp('true')

                    if (typeof localStorage !== 'undefined') {
                        localStorage.setItem("faceImageStamp"+activeStampIndex, true)
                    }

                    setTimeout(() => {
                        setStatusStamp(false)
                        setStartStamp(false)
                        setCapturedAwal(false)

                        sentuhan = {}
                        setTouches([]);
                        ctx.clearRect(0, 0, canvas.width, canvas.height);

                        if(lokasi[0].stamp && lokasi[1].stamp && lokasi[2].stamp && lokasi[3].stamp && lokasi[4].stamp){
                            router.push('/digitalstamp/samsung/spin');
                        }
                    }, 1500);
                }
            }
            

            // setTouches([]);
            // ctx.clearRect(0, 0, canvas.width, canvas.height);
        };

        const checkSquarePattern = (points) => {
            if (points.length !== 2) return false;
            // console.log(points)
    
            // Sort points by x and y positions
            points.sort((a, b) => a.x - b.x || a.y - b.y);
            // const [topLeft, topRight, bottomLeft, bottomRight] = points;
            const [topLeft, topRight] = points;
            // console.log(points)
    
            // Check if edges form a square
            const thresholdXDistMin = 130;
            const thresholdXDistMax = 150;
            const thresholdYDistMin = 80;
            const thresholdYDistMax = 105;

            setTopLeftX(Math.abs(topLeft.x))
            setTopLeftY(Math.abs(topLeft.y))
            if(topRight != undefined){
                setTopRightX(Math.abs(topRight.x))
                setTopRightY(Math.abs(topRight.y))

                setXPos(Math.abs(topRight.x - topLeft.x))
                setYPos(Math.abs(topLeft.y - topRight.y))
            }

            const isXPosMin = Math.abs(topRight.x - topLeft.x) >= thresholdXDistMin;
            const isXPosMax = Math.abs(topRight.x - topLeft.x) <= thresholdXDistMax;
            const isYPosMin = Math.abs(topLeft.y - topRight.y) >= thresholdYDistMin;
            const isYPosMax = Math.abs(topLeft.y - topRight.y) <= thresholdYDistMax;
            const isXRightMoreLeft = topRight.x > topLeft.x;
            const isYLeftMoreRight = topLeft.y > topRight.y;

            return isXPosMin && isXPosMax && isYPosMin && isYPosMax && isXRightMoreLeft && isYLeftMoreRight;
        };
        const getDistance = (p1, p2) => {
            return Math.sqrt(
            Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
            );
        };

        const drawTouches = (ctx, touchPoints) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "blue";
        touchPoints.forEach((t) => {
            ctx.beginPath();
            ctx.arc(t.x, t.y, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.font = "10px Arial";
            ctx.fillText("X : "+t.x+' | Y : '+t.y,t.x -30,t.y+30);
        });
        };

        canvas.addEventListener("touchstart", handleTouchStart);
        canvas.addEventListener("touchmove", handleTouchMove);
        canvas.addEventListener("touchend", handleTouchEnd);

        return () => {
        canvas.removeEventListener("touchstart", handleTouchStart);
        canvas.removeEventListener("touchmove", handleTouchMove);
        canvas.removeEventListener("touchend", handleTouchEnd);
        };
    }, []);


    const mulaiStamp = () => {
        setCapturedAwal(true)
    }
     //STAMP

    return (
        <main className="flex bg-[#F4F4F4] overflow-y-auto overflow-hidden flex-col items-center pt-2 pb-5 px-5 lg:pt-12" onContextMenu={(e)=> e.preventDefault()}>
            <div className={`fixed top-0 left-0 w-full h-full ${capturedAwal ? 'z-50 pointer-events-nonex' : 'z-50 pointer-events-none'}`}>
                <canvas ref={canvasRef} style={{ touchAction: "none" }} className={`relative'`}/>
            </div>

            {/* {!infoJelajahi && 
            <div className={`fixed top-0 left-0 w-full h-full bg-black/80 z-[100] flex items-center justify-center`} onClick={()=> setInfoJelajahi(true)}>
                <div className='w-[80%] mx-auto relative top-[-1rem]'>
                    <Image src='/images/jelajahi.png' width={320} height={500} alt='Zirolu' className='w-full' priority />
                </div>
            </div>
            } */}

            {/* PILIH STYLE */}
            <div className={`relative w-[94%] mx-auto mt-2 z-20`} data-aos="fade-up">
                {/* <div className='w-[50%] mx-auto'>
                    <Image src='/images/samsung-logo2.png' width={175} height={41} alt='Zirolu' className='w-full' priority />
                </div> */}
                <p className={`text-sm font-bold mt-1 text-center text-[#000000]`}>Hi, {profile?.name || 'Pengunjung'}!</p>
                <div className='relative w-full mt-0 p-1 px-0 pt-2'>
                    <Swiper
                        modules={[Pagination]}
                        pagination={{
                            clickable: true,
                        }}
                        className="mySwiper"
                        grabCursor={true}
                        spaceBetween={0}
                        onSlideChange={(swiper) => {
                            setSlideIndex(swiper.activeIndex)
                            setActiveVideoIndex(swiper.activeIndex)
                            activeStampIndex = swiper.activeIndex
                        }}
                        // onSwiper={(swiper) => console.log(swiper)}
                        >

                        {videoRefs.map((videoRef, index) => (
                        <SwiperSlide key={'slider-'+index} className=''>
                            <p className="text-center text-base font-bold mb-3 px-5 min-h-[80px]">
                               {lokasi[index].name}
                            </p>
                            <div className="relative mx-auto w-full flex justify-center items-center flex-col">
                                <Image src={`/images/samsung-box-${index+1}.png`} width={317} height={422}  alt='Zirolu' className='w-full' priority />

                                <div className={`absolute right-[1.6rem] bottom-[3rem] w-[80px] z-50 shadow-xl ${capturedAwal ? '' : 'hidden'} ${lokasi[index].stamp ? 'hidden' : ''}`}>
                                    <Image src={'/images/samsung-stamp-here.png'} width={88} height={88}  alt='Zirolu' className='w-full' priority />
                                </div>

                                <div className={`absolute right-[1.6rem] bottom-[3rem] w-[80px] z-50 shadow-xl  animate-bgScale2 ${lokasi[index].stamp ? '' : 'hidden'}`}>
                                    <Image src={'/images/samsung-stamp-check.png'} width={88} height={88}  alt='Zirolu' className='w-full' priority />
                                </div>

                                {!lokasi[index].stamp &&
                                <div className={`absolute bottom-0 left-0 right-0 pt-[5rem] pb-[4.5rem]  ${capturedAwal ? 'hidden' : ''}`} onClick={mulaiStamp}>
                                    <button className={`relative mx-auto w-[50%] mt-2 flex justify-center items-center animate-bgScale2`}>
                                        <Image src='/images/samsung-tap.png' width={295} height={56} alt='Zirolu' className='w-full' priority />
                                    </button>
                                </div>
                                }
                            </div>
                            <div className='relative w-full mt-5'>
                                <Image src={`/images/cara-${index+1}.png`} width={317} height={422}  alt='Zirolu' className='w-full' priority />
                            </div>
                        </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* <p>{touches.length}</p> */}
                    {/* <p className={`text-center text-base font-medium text-[#2B3B4F] mt-2`}>{slideIndex + 1} / 5</p> */}
                    
                    {statusStamp && startStamp &&
                        <p className={`fixed bottom-[5rem] w-[max-content] pointer-events-none left-0 right-0 inline-block mx-auto text-center px-6 py-2 text-xs bg-[#2A2A5C] rounded-full mt-2 text-[#fff]`}>Stamp done!</p>
                    }

                    <div className='text-center'>
                    {!statusStamp && startStamp &&
                        <p className={`text-center text-base text-[#2B3B4F] mt-0`}></p>
                    }
                    </div>
                </div>

            </div>

            <div className="fixed bottom-0 left-0 right- p-5 text-[#000] bg-red z-50 pointer-events-none opacity-0">
                Top Left X : {topLeftX} | Top Left Y : {topLeftY}<br></br>
                Top Right X : {topRightX} | Top Right Y : {topRightY}<br></br>
                X Dist : {xPos} | Y Dist : {yPos} <br></br>
            </div>
        </main>
    );
}
