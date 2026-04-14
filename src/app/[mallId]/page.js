'use client';

import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { loginSamsung } from '@/lib/auth';


export default function KotaKasablankaPage() {
  const router = useRouter();
  const pathname = usePathname();
  const mallId = pathname.split('/')[1]; // Ambil mallId dari URL
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    phoneType: '',
    phoneModel: '',
    agree: false,
  });

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const valid =
      form.name.trim() &&
      /\S+@\S+\.\S+/.test(form.email) &&
      /^\d{10,}$/.test(form.phone) &&
      form.phoneType &&
      form.phoneModel.trim() &&
      form.agree;

    setIsValid(valid);
  }, [form]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      if (field === 'email') {
        if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.email = 'Format email tidak valid';
        } else {
          delete newErrors.email;
        }
      }

      if (field === 'phone') {
        if (!/^\d{10,}$/.test(value)) {
          newErrors.phone = 'Nomor telepon tidak valid';
        } else {
          delete newErrors.phone;
        }
      }

      if (field === 'name' && value.trim()) delete newErrors.name;
      if (field === 'phoneModel' && value.trim()) delete newErrors.phoneModel;
      if (field === 'agree') delete newErrors.agree;
      if (field === 'phoneType') delete newErrors.phoneType;

      return newErrors;
    });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Nama wajib diisi';
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Format email tidak valid';
    if (!/^\d{10,}$/.test(form.phone)) errs.phone = 'Nomor telepon tidak valid';
    if (!form.phoneType) errs.phoneType = 'Pilih tipe ponsel';
    if (!form.phoneModel.trim()) errs.phoneModel = 'Tipe HP harus diisi';
    if (!form.agree) errs.agree = 'Anda harus menyetujui syarat dan ketentuan';
    return errs;
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const errs = validate();
  //   if (Object.keys(errs).length > 0) {
  //     setErrors(errs);
  //   } else {
  //   //   alert('Form valid! (Siap dikirim)');
  //       localStorage.setItem('formData', JSON.stringify(form));
  //       router.push(mallId+'/home');
  //     // console.log(form);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
    } else {
      setLoading(true);
      try {
        const response = await loginSamsung(form, mallId);
        Cookies.set('tokenDataGSE', response.token, { expires: 7 });
        localStorage.setItem('formDataGSE', JSON.stringify(form));
        localStorage.setItem('tokenDataGSE', response.token);
        router.push(`/${mallId}/home`);
        // console.log(response)
      } catch (error) {
        alert('Gagal daftar: ' + error.message);
      } finally {
        // setLoading(false);
      }

    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-100 px-4 py-10 pt-0">
      <div className={`max-w-md mx-auto w-full transition ${
          !loading ? '' : 'pointer-events-none'
        }`}>
        {/* <h1 className="text-[32px] font-bold text-center leading-snug">
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
        <p className="text-center text-sm text-gray-700 mt-3">
          {/* Daftar sekarang untuk mendapatkan pengalaman&nbsp;Galaxy yang mengagumkan<br />
          dan menangkan hadiah eksklusif <br />
          <strong>Galaxy&nbsp;Z&nbsp;Fold7&nbsp;|&nbsp;Z&nbsp;Flip7</strong> */}
          Daftar sekarang Untuk mendapatkan pengalaman Galaxy yang mengagumkan dan menangkan hadiah eksklusif Galaxy S26 Series
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white mt-6 p-6 rounded-2xl space-y-4"
        >
          {/* Nama */}
          <div>
            <input
              type="text"
              placeholder="Nama lengkap"
              className={`w-full px-4 py-4 rounded-xl border-2 text-base ${
                form.name
                  ? errors.name
                    ? 'border-red-500'
                    : 'border-black'
                  : 'border-gray-300'
              }`}
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              className={`w-full px-4 py-4 rounded-xl border-2 text-base ${
                form.email
                  ? errors.email
                    ? 'border-red-500'
                    : 'border-black'
                  : 'border-gray-300'
              }`}
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Telepon */}
          <div>
            <input
              type="tel"
              placeholder="Nomor telepon"
              className={`w-full px-4 py-4 rounded-xl border-2 text-base ${
                form.phone
                  ? errors.phone
                    ? 'border-red-500'
                    : 'border-black'
                  : 'border-gray-300'
              }`}
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Phone Type Selection */}
          <div>
            <p className="font-medium mt-2 mb-1">
              Ponsel apa yang anda gunakan sekarang?
            </p>
            <div className="space-y-3">
              {['Samsung', 'NonGalaxy'].map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => {
                    handleChange('phoneType', type);
                    handleChange('phoneModel', '');
                  }}
                  className={`w-full px-4 py-4 rounded-xl border-2 text-center text-base font-semibold ${
                    form.phoneType === type
                      ? 'bg-[#686884] text-white'
                      : 'bg-transparent border border-gray-300 text-gray-800'
                  }`}
                >
                  {type === 'Samsung' ? 'Samsung Galaxy' : 'Non-Galaxy'}
                  <div className="text-xs font-normal opacity-70">
                    Tipe HP yang digunakan
                  </div>
                </button>
              ))}
              {errors.phoneType && (
                <p className="text-red-500 text-xs mt-1">{errors.phoneType}</p>
              )}
            </div>

            {/* Phone Model */}
            {form.phoneType && (
              <div className="mt-1">
                <input
                  type="text"
                  placeholder={`Masukkan tipe ${
                    form.phoneType === 'Samsung' ? 'Samsung' : 'HP'
                  }`}
                  className={`w-full px-4 py-4 rounded-xl border-2 text-base mt-2 ${
                    form.phoneModel
                      ? errors.phoneModel
                        ? 'border-red-500'
                        : 'border-black'
                      : 'border-gray-300'
                  }`}
                  value={form.phoneModel}
                  onChange={(e) => handleChange('phoneModel', e.target.value)}
                />
                {errors.phoneModel && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phoneModel}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Checkbox */}
          <label className="flex items-start gap-3 text-sm text-gray-800">
            <input
              type="checkbox"
              checked={form.agree}
              onChange={() => handleChange('agree', !form.agree)}
              className="mt-1 accent-[#686884] w-4 h-4"
            />
            <span>
              Saya memahami bahwa dengan mendaftar di sini saya setuju untuk
              menerima komunikasi marketing dari Samsung dan/atau partner
              Samsung
            </span>
          </label>
          {errors.agree && (
            <p className="text-red-500 text-xs mt-1">{errors.agree}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid || loading}
            className={`w-full transition ${
              isValid && !loading ? 'cursor-pointer' : 'opacity-20 cursor-not-allowed'
            }`}>
            {loading ? (
              <p className="text-center py-3">Mengirim data...</p>
            ) : (
              <Image
                src="/images/bloom/btn-daftar.png"
                className="w-full"
                alt="Samsung"
                width={288}
                height={56}
                priority
              />
            )}
          </button>

          {/* <button
            type="submit"
            disabled={!isValid}
            className={`w-full transition ${
              isValid
                ? 'cursor-pointer'
                : 'opacity-20 cursor-not-allowed'
            }`}>
          <Image
            src="/images/btn-daftar.png"
            className='w-full'
            alt="Samsung"
            width={288}
            height={56}
            priority
          />
          </button> */}
        </form>
      </div>
    </div>
  );
}
