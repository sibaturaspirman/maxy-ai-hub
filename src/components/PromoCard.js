import Image from 'next/image';

export default function PromoCard({ label, title, description, image }) {
  return (
    <div className="flex items-center justify-between p-5 bg-white rounded-2xl mb-3">
      <div className='pr-3'>
        <p className="text-[10px] text-blue-600 font-semibold mb-2">{label}</p>
        <h3 className="text-lg font-bold leading-snug">{title}</h3>
        <p className="text-base text-gray-700 mt-1 leading-relaxed">{description}</p>
      </div>
      <div className="w-[48px] h-[48px] flex-shrink-0">
        {image ? (
          <Image
            src={image}
            alt={title}
            width={64}
            height={64}
            className="object-contain"
          />
        ) : (
          <div className="w-[48px] h-[48px] bg-gray-400 rounded-full" />
        )}
      </div>
    </div>
  );
}
