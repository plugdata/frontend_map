# UI MUI Project

โปรเจคระบบจัดการข้อมูลเมืองอัจฉริยะ (Smart City) ที่พัฒนาด้วย Next.js และ Tailwind CSS

## 🏗️ โครงสร้างโปรเจค

### 📁 Components
- **`TabNavigation.js`** - ส่วน Navigation Tabs
- **`SearchFilters.js`** - ส่วน Search และ Filters
- **`DataDisplay.js`** - ส่วนแสดงข้อมูลและ Cards
- **`MapPanel.js`** - ส่วนแสดงแผนที่
- **`LoadingState.js`** - ส่วนแสดงสถานะ Loading
- **`ErrorState.js`** - ส่วนแสดงสถานะ Error

### 📁 Hooks
- **`useApiData.js`** - Custom hook สำหรับจัดการข้อมูลจาก API
- **`useTabData.js`** - Custom hook สำหรับจัดการข้อมูลของแต่ละ tab

### 📁 Utils
- **`tabConfig.js`** - ข้อมูลการตั้งค่าของแต่ละ tab

## 🚀 ระบบที่รองรับ

1. **ระบบใบอนุญาตสิ่งปลูกสร้าง** - จัดการใบอนุญาตก่อสร้าง
2. **ระบบงานสาธารณะ** - ติดตามโครงการก่อสร้าง
3. **ระบบงานผังเมือง** - จัดการแผนงานผังเมือง

## ✨ คุณสมบัติหลัก

- Responsive Design
- Real-time Search
- Advanced Filtering
- Interactive Map
- Component-based Architecture 