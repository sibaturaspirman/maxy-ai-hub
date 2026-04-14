'use client';
import Image from 'next/image';

export default function KeyVisual({mallId}) {
  return (
    <section className="mt-10" data-aos="fade-up">
      <h3 className="font-semibold text-center text-2xl mb-3 px-5">Ikuti kompetisi media sosial dan menangkan hadiah</h3>
      <div className='w-full'>

      {mallId === 'MallKelapaGading4' ? (
        <Image
        src='/images/bloom/kv-mkg.png'
        alt='Samsung'
        width={360}
        height={509}
        className="w-full"
        />
      ) : (
        <Image
        src='/images/bloom/kv-gi.jpg'
        alt='Samsung'
        width={360}
        height={509}
        className="w-full"
      />
      )}

      </div>
    </section>
  );
}
