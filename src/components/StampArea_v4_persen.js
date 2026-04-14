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
  
  // Threshold dalam persentase lebar layar (% vw) agar konsisten di semua HP
  const thresholds = {
    upperToLowerRight: { min: 41, max: 68 },
    lowerLeftToLowerRight: { min: 27, max: 50 },
    upperToLowerLeft: { min: 26, max: 74 }
  };

  // Rasio antar jarak untuk validasi bentuk segitiga stamp
  const ratioThresholds = {
    urLr_over_llLr: { min: 0.85, max: 2.0 },
    urLl_over_llLr: { min: 0.7, max: 1.85 }
  };
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
  const [touchCount, setTouchCount] = useState(0);

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
  const [debugInfo, setDebugInfo] = useState({
    upperRight: null,
    lowerLeft: null,
    lowerRight: null,
    distances: {
      upperToLowerRight: 0,
      lowerLeftToLowerRight: 0,
      upperToLowerLeft: 0
    },
    percentages: {
      upperToLowerRight: 0,
      lowerLeftToLowerRight: 0,
      upperToLowerLeft: 0
    },
    ratios: {
      urLr_over_llLr: 0,
      urLl_over_llLr: 0
    },
    thresholds,
    isValid: {
      upperToLowerRight: false,
      lowerLeftToLowerRight: false,
      upperToLowerLeft: false
    },
    isValidRatios: false,
    screenWidth: 0
  });

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

  const drawThreePoints = (ctx, canvas, upperRight, lowerLeft, lowerRight, distances) => {
    if (!ctx || !canvas || !upperRight || !lowerLeft || !lowerRight) return;

    // Bersihkan canvas sebelum menggambar ulang
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gambar garis antar titik
    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 2;
    
    // Garis dari upper right ke lower right
    ctx.beginPath();
    ctx.moveTo(upperRight.x, upperRight.y);
    ctx.lineTo(lowerRight.x, lowerRight.y);
    ctx.stroke();
    
    // Garis dari lower left ke lower right
    ctx.beginPath();
    ctx.moveTo(lowerLeft.x, lowerLeft.y);
    ctx.lineTo(lowerRight.x, lowerRight.y);
    ctx.stroke();
    
    // Garis dari upper right ke lower left
    ctx.beginPath();
    ctx.moveTo(upperRight.x, upperRight.y);
    ctx.lineTo(lowerLeft.x, lowerLeft.y);
    ctx.stroke();

    // Gambar titik dan label
    const points = [
      { point: upperRight, label: "Upper Right", color: "#ff0000" },
      { point: lowerLeft, label: "Lower Left", color: "#0000ff" },
      { point: lowerRight, label: "Lower Right", color: "#ffff00" }
    ];

    points.forEach(({ point, label, color }) => {
      // Gambar lingkaran titik
      ctx.beginPath();
      ctx.arc(point.x, point.y, 25, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Tampilkan label dan koordinat
      ctx.font = "bold 14px Arial";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.fillText(label, point.x, point.y - 35);
      
      ctx.font = "12px Arial";
      ctx.fillText(
        `X: ${Math.round(point.x)} Y: ${Math.round(point.y)}`,
        point.x,
        point.y + 45
      );
    });

    // Tampilkan jarak di tengah garis
    ctx.font = "bold 12px Arial";
    ctx.fillStyle = "#00ff00";
    ctx.textAlign = "center";
    
    // Jarak upper right ke lower right
    const midUR_LR = {
      x: (upperRight.x + lowerRight.x) / 2,
      y: (upperRight.y + lowerRight.y) / 2
    };
    ctx.fillText(
      `${Math.round(distances.upperToLowerRight)}px`,
      midUR_LR.x,
      midUR_LR.y - 5
    );
    
    // Jarak lower left ke lower right
    const midLL_LR = {
      x: (lowerLeft.x + lowerRight.x) / 2,
      y: (lowerLeft.y + lowerRight.y) / 2
    };
    ctx.fillText(
      `${Math.round(distances.lowerLeftToLowerRight)}px`,
      midLL_LR.x,
      midLL_LR.y - 5
    );
    
    // Jarak upper right ke lower left
    const midUR_LL = {
      x: (upperRight.x + lowerLeft.x) / 2,
      y: (upperRight.y + lowerLeft.y) / 2
    };
    ctx.fillText(
      `${Math.round(distances.upperToLowerLeft)}px`,
      midUR_LL.x,
      midUR_LL.y - 5
    );
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

  const handleTouchStart = async (e) => {
    if (statusStamp) return; // sudah berhasil stamp, skip

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

    // Update jumlah touch
    setTouchCount(e.touches.length);

    // Validasi pattern dengan 3 titik
    const points = Object.values(sentuhanRef.current);
    
    // Hanya validasi jika sudah ada 3 titik
    if (points.length === 3) {
      // Identifikasi titik-titik
      const upperRight = points.reduce((max, point) => {
        if (!max) return point;
        if (point.x > max.x || (point.x === max.x && point.y < max.y)) {
          return point;
        }
        return max;
      });

      const lowerLeft = points.reduce((min, point) => {
        if (!min) return point;
        if (point.x < min.x || (point.x === min.x && point.y > min.y)) {
          return point;
        }
        return min;
      });

      const lowerRight = points.find(point => 
        !(point.x === upperRight.x && point.y === upperRight.y) &&
        !(point.x === lowerLeft.x && point.y === lowerLeft.y)
      );

      if (upperRight && lowerLeft && lowerRight) {
        const screenWidth = canvas.width;

        // Hitung jarak (px)
        const distUpperToLowerRight = Math.sqrt(
          Math.pow(upperRight.x - lowerRight.x, 2) + 
          Math.pow(upperRight.y - lowerRight.y, 2)
        );
        const distLowerLeftToLowerRight = Math.sqrt(
          Math.pow(lowerLeft.x - lowerRight.x, 2) + 
          Math.pow(lowerLeft.y - lowerRight.y, 2)
        );
        const distUpperToLowerLeft = Math.sqrt(
          Math.pow(upperRight.x - lowerLeft.x, 2) + 
          Math.pow(upperRight.y - lowerLeft.y, 2)
        );

        // Konversi ke persentase lebar layar
        const pctUR_LR = (distUpperToLowerRight / screenWidth) * 100;
        const pctLL_LR = (distLowerLeftToLowerRight / screenWidth) * 100;
        const pctUR_LL = (distUpperToLowerLeft / screenWidth) * 100;

        // Validasi jarak (%) terhadap threshold
        const isValidUpperToLowerRight = pctUR_LR >= thresholds.upperToLowerRight.min && 
          pctUR_LR <= thresholds.upperToLowerRight.max;
        const isValidLowerLeftToLowerRight = pctLL_LR >= thresholds.lowerLeftToLowerRight.min && 
          pctLL_LR <= thresholds.lowerLeftToLowerRight.max;
        const isValidUpperToLowerLeft = pctUR_LL >= thresholds.upperToLowerLeft.min && 
          pctUR_LL <= thresholds.upperToLowerLeft.max;

        // Validasi rasio antar jarak (bentuk segitiga harus sesuai stamp)
        const ratio_urLr_llLr = distLowerLeftToLowerRight > 0 ? distUpperToLowerRight / distLowerLeftToLowerRight : 0;
        const ratio_urLl_llLr = distLowerLeftToLowerRight > 0 ? distUpperToLowerLeft / distLowerLeftToLowerRight : 0;
        const isValidRatios =
          ratio_urLr_llLr >= ratioThresholds.urLr_over_llLr.min &&
          ratio_urLr_llLr <= ratioThresholds.urLr_over_llLr.max &&
          ratio_urLl_llLr >= ratioThresholds.urLl_over_llLr.min &&
          ratio_urLl_llLr <= ratioThresholds.urLl_over_llLr.max;

        // Update debug info
        setDebugInfo({
          upperRight,
          lowerLeft,
          lowerRight,
          distances: {
            upperToLowerRight: distUpperToLowerRight,
            lowerLeftToLowerRight: distLowerLeftToLowerRight,
            upperToLowerLeft: distUpperToLowerLeft
          },
          percentages: {
            upperToLowerRight: pctUR_LR,
            lowerLeftToLowerRight: pctLL_LR,
            upperToLowerLeft: pctUR_LL
          },
          ratios: {
            urLr_over_llLr: ratio_urLr_llLr,
            urLl_over_llLr: ratio_urLl_llLr
          },
          thresholds,
          isValid: {
            upperToLowerRight: isValidUpperToLowerRight,
            lowerLeftToLowerRight: isValidLowerLeftToLowerRight,
            upperToLowerLeft: isValidUpperToLowerLeft
          },
          isValidRatios,
          screenWidth
        });

        // Cek apakah semua jarak + rasio valid
        const allDistancesValid = isValidUpperToLowerRight && isValidLowerLeftToLowerRight && isValidUpperToLowerLeft && isValidRatios;

        if (allDistancesValid) {
          await handleStamp();
        } else {
          setStatusStamp(false);
        }
      }
    } else {
      // Tampilkan semua titik jika belum 3
      drawTouches(ctx, canvas, points);
      // Reset statusStamp jika belum 3 titik
      setStatusStamp(false);
    }
  };

  const handleTouchMove = (e) => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    const rect = canvas.getBoundingClientRect();

    // Update sentuhan yang bergerak
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      sentuhanRef.current[touch.identifier] = { x, y };
    }

    const points = Object.values(sentuhanRef.current);

    if (points.length === 3) {
      // Identifikasi titik-titik
      const upperRight = points.reduce((max, point) => {
        if (!max) return point;
        if (point.x > max.x || (point.x === max.x && point.y < max.y)) {
          return point;
        }
        return max;
      });

      const lowerLeft = points.reduce((min, point) => {
        if (!min) return point;
        if (point.x < min.x || (point.x === min.x && point.y > min.y)) {
          return point;
        }
        return min;
      });

      const lowerRight = points.find(point => 
        !(point.x === upperRight.x && point.y === upperRight.y) &&
        !(point.x === lowerLeft.x && point.y === lowerLeft.y)
      );

      if (upperRight && lowerLeft && lowerRight) {
        const screenWidth = canvas.width;

        // Hitung jarak (px)
        const distUpperToLowerRight = Math.sqrt(
          Math.pow(upperRight.x - lowerRight.x, 2) + 
          Math.pow(upperRight.y - lowerRight.y, 2)
        );
        const distLowerLeftToLowerRight = Math.sqrt(
          Math.pow(lowerLeft.x - lowerRight.x, 2) + 
          Math.pow(lowerLeft.y - lowerRight.y, 2)
        );
        const distUpperToLowerLeft = Math.sqrt(
          Math.pow(upperRight.x - lowerLeft.x, 2) + 
          Math.pow(upperRight.y - lowerLeft.y, 2)
        );

        // Konversi ke persentase lebar layar
        const pctUR_LR = (distUpperToLowerRight / screenWidth) * 100;
        const pctLL_LR = (distLowerLeftToLowerRight / screenWidth) * 100;
        const pctUR_LL = (distUpperToLowerLeft / screenWidth) * 100;

        // Validasi jarak (%) terhadap threshold
        const isValidUpperToLowerRight = pctUR_LR >= thresholds.upperToLowerRight.min && 
          pctUR_LR <= thresholds.upperToLowerRight.max;
        const isValidLowerLeftToLowerRight = pctLL_LR >= thresholds.lowerLeftToLowerRight.min && 
          pctLL_LR <= thresholds.lowerLeftToLowerRight.max;
        const isValidUpperToLowerLeft = pctUR_LL >= thresholds.upperToLowerLeft.min && 
          pctUR_LL <= thresholds.upperToLowerLeft.max;

        // Validasi rasio antar jarak
        const ratio_urLr_llLr = distLowerLeftToLowerRight > 0 ? distUpperToLowerRight / distLowerLeftToLowerRight : 0;
        const ratio_urLl_llLr = distLowerLeftToLowerRight > 0 ? distUpperToLowerLeft / distLowerLeftToLowerRight : 0;
        const isValidRatios =
          ratio_urLr_llLr >= ratioThresholds.urLr_over_llLr.min &&
          ratio_urLr_llLr <= ratioThresholds.urLr_over_llLr.max &&
          ratio_urLl_llLr >= ratioThresholds.urLl_over_llLr.min &&
          ratio_urLl_llLr <= ratioThresholds.urLl_over_llLr.max;

        // Update debug info
        setDebugInfo({
          upperRight,
          lowerLeft,
          lowerRight,
          distances: {
            upperToLowerRight: distUpperToLowerRight,
            lowerLeftToLowerRight: distLowerLeftToLowerRight,
            upperToLowerLeft: distUpperToLowerLeft
          },
          percentages: {
            upperToLowerRight: pctUR_LR,
            lowerLeftToLowerRight: pctLL_LR,
            upperToLowerLeft: pctUR_LL
          },
          ratios: {
            urLr_over_llLr: ratio_urLr_llLr,
            urLl_over_llLr: ratio_urLl_llLr
          },
          thresholds,
          isValid: {
            upperToLowerRight: isValidUpperToLowerRight,
            lowerLeftToLowerRight: isValidLowerLeftToLowerRight,
            upperToLowerLeft: isValidUpperToLowerLeft
          },
          isValidRatios,
          screenWidth
        });
      }
    } else {
      // Tampilkan semua titik jika belum 3
      drawTouches(ctx, canvas, points);
    }
  };

  const checkThreePointPattern = (points) => {
    if (points.length !== 3) return false;

    // Sort points: upper right, lower left, lower right
    // Upper right: x besar, y kecil
    // Lower left: x kecil, y besar
    // Lower right: x besar, y besar
    
    // Cari titik berdasarkan posisi
    let upperRight = null;
    let lowerLeft = null;
    let lowerRight = null;

    // Cari upper right (x terbesar, y terkecil)
    upperRight = points.reduce((max, point) => {
      if (!max) return point;
      // Prioritaskan x besar, jika sama pilih y kecil
      if (point.x > max.x || (point.x === max.x && point.y < max.y)) {
        return point;
      }
      return max;
    });

    // Cari lower left (x terkecil, y terbesar)
    lowerLeft = points.reduce((min, point) => {
      if (!min) return point;
      // Prioritaskan x kecil, jika sama pilih y besar
      if (point.x < min.x || (point.x === min.x && point.y > min.y)) {
        return point;
      }
      return min;
    });

    // Cari lower right (x besar, y besar) - yang bukan upperRight dan bukan lowerLeft
    // Gunakan perbandingan nilai x dan y, bukan reference object
    lowerRight = points.find(point => 
      !(point.x === upperRight.x && point.y === upperRight.y) &&
      !(point.x === lowerLeft.x && point.y === lowerLeft.y)
    );

    if (!upperRight || !lowerLeft || !lowerRight) return false;

    // Validasi posisi relatif
    const isUpperRightValid = upperRight.x > lowerLeft.x && upperRight.y < lowerLeft.y;
    const isLowerRightValid = lowerRight.x > lowerLeft.x && lowerRight.y > upperRight.y;
    const isLowerLeftValid = lowerLeft.x < upperRight.x && lowerLeft.x < lowerRight.x;

    // Validasi jarak antar titik
    const distUpperToLowerRight = Math.sqrt(
      Math.pow(upperRight.x - lowerRight.x, 2) + 
      Math.pow(upperRight.y - lowerRight.y, 2)
    );
    const distLowerLeftToLowerRight = Math.sqrt(
      Math.pow(lowerLeft.x - lowerRight.x, 2) + 
      Math.pow(lowerLeft.y - lowerRight.y, 2)
    );
    const distUpperToLowerLeft = Math.sqrt(
      Math.pow(upperRight.x - lowerLeft.x, 2) + 
      Math.pow(upperRight.y - lowerLeft.y, 2)
    );

    // Konversi ke persentase lebar layar
    const screenWidth = window.innerWidth;
    const pctUR_LR = (distUpperToLowerRight / screenWidth) * 100;
    const pctLL_LR = (distLowerLeftToLowerRight / screenWidth) * 100;
    const pctUR_LL = (distUpperToLowerLeft / screenWidth) * 100;

    // Validasi jarak (%) terhadap threshold
    const isValidDistance = 
      pctUR_LR >= thresholds.upperToLowerRight.min && 
      pctUR_LR <= thresholds.upperToLowerRight.max &&
      pctLL_LR >= thresholds.lowerLeftToLowerRight.min && 
      pctLL_LR <= thresholds.lowerLeftToLowerRight.max &&
      pctUR_LL >= thresholds.upperToLowerLeft.min && 
      pctUR_LL <= thresholds.upperToLowerLeft.max;

    // Validasi rasio antar jarak
    const ratio_urLr_llLr = distLowerLeftToLowerRight > 0 ? distUpperToLowerRight / distLowerLeftToLowerRight : 0;
    const ratio_urLl_llLr = distLowerLeftToLowerRight > 0 ? distUpperToLowerLeft / distLowerLeftToLowerRight : 0;
    const isValidRatios =
      ratio_urLr_llLr >= ratioThresholds.urLr_over_llLr.min &&
      ratio_urLr_llLr <= ratioThresholds.urLr_over_llLr.max &&
      ratio_urLl_llLr >= ratioThresholds.urLl_over_llLr.min &&
      ratio_urLl_llLr <= ratioThresholds.urLl_over_llLr.max;

    // Update state untuk debug
    setTopLeftX(Math.round(lowerLeft.x));
    setTopLeftY(Math.round(lowerLeft.y));
    setTopRightX(Math.round(upperRight.x));
    setTopRightY(Math.round(upperRight.y));
    setXPos(Math.round(lowerRight.x - lowerLeft.x));
    setYPos(Math.round(lowerRight.y - upperRight.y));

    return isUpperRightValid && isLowerRightValid && isLowerLeftValid && isValidDistance && isValidRatios;
  };

  const handleStamp = async () => {
    setLoadingStamp(true);
    const token = localStorage.getItem("tokenDataGSE");

    try {
      // const response = await postStamp(boothID, token);
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
      // drawCapGrid(ctx, canvas, "green");

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
    // Reset jumlah touch saat semua jari diangkat
    setTouchCount(e.touches.length);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    
    if (ctx && canvas) {
      // Clear canvas atau reset ke state awal jika perlu
      // ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    setTouchCount(0);
    setDebugInfo(prev => ({
      ...prev,
      isValid: {
        upperToLowerRight: false,
        lowerLeftToLowerRight: false,
        upperToLowerLeft: false
      }
    }));
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

        <div className="hiddenx absolute z-[50] mt-[-5rem] pointer-events-none">
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
              <p className="text-center py-3 text-[#fff] font-bold text-2xl mt-4 opacity-0">Stamp Disini</p>
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
              <p className="text-center py-3 text-blue-400 font-bold text-2xl mt-4">Stamp berhasil!</p>
            </div>
          )}

          {/* {loadingStamp ? (
            <p className="text-center py-3 text-[#fff] font-bold text-2xl mt-4">
              Validasi&nbsp;berlangsung...
            </p>
          ) : (
            <p className="text-center py-3 text-[#fff] font-bold text-2xl mt-4 opacity-100">Validasi</p>
          )} */}

          {/* 3 titik cek pattern  */}
          <div className="flex items-center justify-center gap-4 mt-[2.5rem]">
            {/* Upper Right */}
            <div
              className="w-10 h-10 rounded-full transition-all duration-300"
              style={{
                backgroundColor: debugInfo.isValid?.upperToLowerRight && debugInfo.isValid?.upperToLowerLeft
                  ? '#3B82F6'
                  : touchCount > 0 ? '#EAB308' : '#4B5563',
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: debugInfo.isValid?.upperToLowerRight && debugInfo.isValid?.upperToLowerLeft
                  ? '#60A5FA'
                  : touchCount > 0 ? '#FACC15' : '#6B7280',
                boxShadow: debugInfo.isValid?.upperToLowerRight && debugInfo.isValid?.upperToLowerLeft
                  ? '0 0 10px rgba(59,130,246,0.6)'
                  : touchCount > 0 ? '0 0 10px rgba(234,179,8,0.6)' : 'none'
              }}
            />
            {/* Lower Left */}
            <div
              className="w-10 h-10 rounded-full transition-all duration-300"
              style={{
                backgroundColor: debugInfo.isValid?.upperToLowerLeft && debugInfo.isValid?.lowerLeftToLowerRight
                  ? '#3B82F6'
                  : touchCount > 0 ? '#EAB308' : '#4B5563',
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: debugInfo.isValid?.upperToLowerLeft && debugInfo.isValid?.lowerLeftToLowerRight
                  ? '#60A5FA'
                  : touchCount > 0 ? '#FACC15' : '#6B7280',
                boxShadow: debugInfo.isValid?.upperToLowerLeft && debugInfo.isValid?.lowerLeftToLowerRight
                  ? '0 0 10px rgba(59,130,246,0.6)'
                  : touchCount > 0 ? '0 0 10px rgba(234,179,8,0.6)' : 'none'
              }}
            />
            {/* Lower Right */}
            <div
              className="w-10 h-10 rounded-full transition-all duration-300"
              style={{
                backgroundColor: debugInfo.isValid?.upperToLowerRight && debugInfo.isValid?.lowerLeftToLowerRight
                  ? '#3B82F6'
                  : touchCount > 0 ? '#EAB308' : '#4B5563',
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: debugInfo.isValid?.upperToLowerRight && debugInfo.isValid?.lowerLeftToLowerRight
                  ? '#60A5FA'
                  : touchCount > 0 ? '#FACC15' : '#6B7280',
                boxShadow: debugInfo.isValid?.upperToLowerRight && debugInfo.isValid?.lowerLeftToLowerRight
                  ? '0 0 10px rgba(59,130,246,0.6)'
                  : touchCount > 0 ? '0 0 10px rgba(234,179,8,0.6)' : 'none'
              }}
            />
          </div>

          {/* Jarak Antar Titik (% vw) */}
          <div className="mt-4 flex justify-center gap-3" style={{ fontFamily: 'monospace', fontSize: '11px' }}>
            <span style={{ color: debugInfo.isValid?.upperToLowerRight ? '#3B82F6' : '#9CA3AF' }}>
              UR→LR: {(debugInfo.percentages?.upperToLowerRight || 0).toFixed(1)}%
            </span>
            <span style={{ color: debugInfo.isValid?.lowerLeftToLowerRight ? '#3B82F6' : '#9CA3AF' }}>
              LL→LR: {(debugInfo.percentages?.lowerLeftToLowerRight || 0).toFixed(1)}%
            </span>
            <span style={{ color: debugInfo.isValid?.upperToLowerLeft ? '#3B82F6' : '#9CA3AF' }}>
              UR→LL: {(debugInfo.percentages?.upperToLowerLeft || 0).toFixed(1)}%
            </span>
          </div>
          {/* Rasio + screen width */}
          <div className="mt-1 flex justify-center gap-3" style={{ fontFamily: 'monospace', fontSize: '10px' }}>
            <span style={{ color: debugInfo.isValidRatios ? '#3B82F6' : '#9CA3AF' }}>
              R1: {(debugInfo.ratios?.urLr_over_llLr || 0).toFixed(2)} R2: {(debugInfo.ratios?.urLl_over_llLr || 0).toFixed(2)}
            </span>
            <span style={{ color: '#6B7280' }}>
              vw: {debugInfo.screenWidth || 0}
            </span>
          </div>

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

      <div className="fixed bottom-[5rem] left-0 right-0 p-5 text-[#fff] bg-black/80 z-[9999] pointer-events-none hidden">
        <div className="text-xs font-mono">
          <div className="mb-2">
            <span className="text-red-400">Upper Right:</span> X: {debugInfo.upperRight ? Math.round(debugInfo.upperRight.x) : '-'} Y: {debugInfo.upperRight ? Math.round(debugInfo.upperRight.y) : '-'}
          </div>
          <div className="mb-2">
            <span className="text-blue-400">Lower Left:</span> X: {debugInfo.lowerLeft ? Math.round(debugInfo.lowerLeft.x) : '-'} Y: {debugInfo.lowerLeft ? Math.round(debugInfo.lowerLeft.y) : '-'}
          </div>
          <div className="mb-2">
            <span className="text-yellow-400">Lower Right:</span> X: {debugInfo.lowerRight ? Math.round(debugInfo.lowerRight.x) : '-'} Y: {debugInfo.lowerRight ? Math.round(debugInfo.lowerRight.y) : '-'}
          </div>
          <div className="mt-3 pt-2 border-t border-gray-600">
            <div className="text-green-400 mb-2 font-bold">Jarak Antar Titik:</div>
            <div className="mb-2">
              <div className="flex justify-between items-center">
                <span>Upper Right → Lower Right:</span>
                <span className={`font-bold ${debugInfo.isValid?.upperToLowerRight ? 'text-green-400' : 'text-red-400'}`}>
                  {(debugInfo.percentages?.upperToLowerRight || 0).toFixed(1)}% ({Math.round(debugInfo.distances.upperToLowerRight)}px)
                </span>
              </div>
              <div className="text-xs text-gray-400 ml-2">
                Threshold: {debugInfo.thresholds?.upperToLowerRight.min}% - {debugInfo.thresholds?.upperToLowerRight.max}%
                {debugInfo.isValid?.upperToLowerRight ? ' ✓' : ' ✗'}
              </div>
            </div>
            <div className="mb-2">
              <div className="flex justify-between items-center">
                <span>Lower Left → Lower Right:</span>
                <span className={`font-bold ${debugInfo.isValid?.lowerLeftToLowerRight ? 'text-green-400' : 'text-red-400'}`}>
                  {(debugInfo.percentages?.lowerLeftToLowerRight || 0).toFixed(1)}% ({Math.round(debugInfo.distances.lowerLeftToLowerRight)}px)
                </span>
              </div>
              <div className="text-xs text-gray-400 ml-2">
                Threshold: {debugInfo.thresholds?.lowerLeftToLowerRight.min}% - {debugInfo.thresholds?.lowerLeftToLowerRight.max}%
                {debugInfo.isValid?.lowerLeftToLowerRight ? ' ✓' : ' ✗'}
              </div>
            </div>
            <div className="mb-2">
              <div className="flex justify-between items-center">
                <span>Upper Right → Lower Left:</span>
                <span className={`font-bold ${debugInfo.isValid?.upperToLowerLeft ? 'text-green-400' : 'text-red-400'}`}>
                  {(debugInfo.percentages?.upperToLowerLeft || 0).toFixed(1)}% ({Math.round(debugInfo.distances.upperToLowerLeft)}px)
                </span>
              </div>
              <div className="text-xs text-gray-400 ml-2">
                Threshold: {debugInfo.thresholds?.upperToLowerLeft.min}% - {debugInfo.thresholds?.upperToLowerLeft.max}%
                {debugInfo.isValid?.upperToLowerLeft ? ' ✓' : ' ✗'}
              </div>
            </div>
            <div className="mb-2 pt-2 border-t border-gray-600">
              <div className="text-purple-400 mb-1 font-bold">Rasio & Screen:</div>
              <div className="flex justify-between">
                <span>UR→LR / LL→LR:</span>
                <span className={`font-bold ${debugInfo.isValidRatios ? 'text-green-400' : 'text-red-400'}`}>
                  {(debugInfo.ratios?.urLr_over_llLr || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>UR→LL / LL→LR:</span>
                <span className={`font-bold ${debugInfo.isValidRatios ? 'text-green-400' : 'text-red-400'}`}>
                  {(debugInfo.ratios?.urLl_over_llLr || 0).toFixed(2)}
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Screen width: {debugInfo.screenWidth || 0}px
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
