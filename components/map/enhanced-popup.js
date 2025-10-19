"use client";

import { useState, useEffect } from "react";
import { MapPin, Globe, Phone, Mail, Clock, Star, Users, Calendar, X, Navigation } from "lucide-react";
import styles from "./popup-styles.module.css";

export default function EnhancedPopup({ location, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Reset image index when location changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [location?.id]);
  
  if (!location) return null;

  // สร้าง array ของรูปภาพ (ใช้รูปเดียวหรือหลายรูป)
  const images = (() => {
    // Debug logging
    console.log('EnhancedPopup - Location data:', {
      id: location.id,
      name: location.name,
      hasImages: !!location.images,
      imagesLength: location.images?.length || 0,
      hasImage: !!location.image,
      imageUrl: location.image
    });
    
    // ถ้ามี images array และไม่ว่าง
    if (location.images && Array.isArray(location.images) && location.images.length > 0) {
      // กรองเฉพาะรูปที่มี url
      const validImages = location.images.filter(img => img && img.url);
      console.log('EnhancedPopup - Valid images found:', validImages.length);
      return validImages;
    }
    
    // ถ้ามี image เดียว
    if (location.image) {
      console.log('EnhancedPopup - Using single image:', location.image);
      return [{ url: location.image, caption: location.name }];
    }
    
    // ถ้าไม่มีรูปเลย ให้ใช้รูป placeholder
    console.log('EnhancedPopup - No images found, using placeholder');
    return [{ 
      url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
        <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f3f4f6"/>
          <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="14">
            ไม่มีรูปภาพ
          </text>
        </svg>
      `), 
      caption: 'ไม่มีรูปภาพ' 
    }];
  })();

  // ตรวจสอบว่า currentImageIndex อยู่ในขอบเขตที่ถูกต้อง
  const safeCurrentImageIndex = Math.max(0, Math.min(currentImageIndex, images.length - 1));
  const currentImage = images[safeCurrentImageIndex];

  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="w-72 max-w-sm bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Photo Slider Section */}
      <div className="relative h-36">
        {currentImage && (
          <img
            src={currentImage.url}
            alt={currentImage.caption || location.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.target.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
                <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100%" height="100%" fill="#f3f4f6"/>
                  <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="14">
                    ไม่สามารถโหลดรูปภาพ
                  </text>
                </svg>
              `);
            }}
          />
        )}
        
        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 text-gray-800 border-none rounded-full w-7 h-7 cursor-pointer text-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
            >
              ‹
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 text-gray-800 border-none rounded-full w-7 h-7 cursor-pointer text-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
            >
              ›
            </button>
          </>
        )}

        {/* Image counter dots */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-colors ${
                  index === safeCurrentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Location Info Card */}
      <div className="p-3">
        {/* Header with title */}
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 m-0 truncate">
            {location.name}
          </h3>
        </div>

        {/* Action buttons */}
        <div className="flex gap-1 mb-2">
          <button 
            className="bg-blue-100 text-blue-700 border-none rounded-full px-2 py-1 text-xs font-medium cursor-pointer flex items-center gap-1 hover:bg-blue-200 transition-colors"
            onClick={() => {
              // ไปที่หมุด - ใช้ Google Maps
              const url = `https://www.google.com/maps/search/?api=1&query=${location.coordinates[0]},${location.coordinates[1]}`;
              window.open(url, '_blank');
            }}
          >
            <span>📍</span>
            <span>ไปที่หมุด</span>
          </button>
          <button 
            className="bg-green-100 text-green-700 border-none rounded-full px-2 py-1 text-xs font-medium cursor-pointer flex items-center gap-1 hover:bg-green-200 transition-colors"
            onClick={() => {
              // โหลดเอกสาร - เปิดลิงก์เอกสาร
              if (location.documentUrl) {
                window.open(location.documentUrl, '_blank');
              } else {
                // ถ้าไม่มีเอกสาร ให้แสดงข้อความ
                alert('ไม่มีเอกสารสำหรับสถานที่นี้');
              }
            }}
          >
            <span>📄</span>
            <span>โหลดเอกสาร</span>
          </button>
        </div>

        {/* Contact Information - Minimal */}
        <div className="space-y-1.5 mb-2">
          {/* Address */}
          <div className="flex items-center text-xs text-gray-500">
            <span className="mr-2 text-xs">📍</span>
            <span className="truncate">{location.address}</span>
          </div>

          {/* Phone */}
          <div className="flex items-center text-xs text-gray-500">
            <span className="mr-2 text-xs">📞</span>
            <a 
              href={`tel:${location.phone}`}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              {location.phone}
            </a>
          </div>

          {/* Opening Hours */}
          {location.openingHours && (
            <div className="flex items-center text-xs text-gray-500">
              <span className="mr-2 text-xs">🕒</span>
              <span className="truncate">{location.openingHours.split('\n')[0]}</span>
            </div>
          )}
        </div>

        {/* Description - Shortened */}
        <p className={`text-xs text-gray-600 leading-relaxed mb-2 ${styles.lineClamp2}`}>
          {location.description}
        </p>

        {/* Type badge - Minimal */}
        <div className="flex justify-between items-center">
          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium uppercase">
            {location.type}
          </span>
          {location.rating && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-yellow-500">★</span>
              <span className="text-xs text-gray-600">{location.rating}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
