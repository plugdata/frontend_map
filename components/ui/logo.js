import Image from "next/image"

export default function Logo() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Image 
        src="/img/Seal_of_Trang.png" 
        alt="ตราสัญลักษณ์เทศบาล" 
        width={64} 
        height={64}
        className="object-contain drop-shadow-sm"
        priority
      />
    </div>
  )
}
