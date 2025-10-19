# การตั้งค่า TMD API (กรมอุตุนิยมวิทยาไทย)

## ข้อมูล API
- **URL**: https://data.tmd.go.th/nwpapi/doc/apidoc/location/forecast_daily.html
- **Provider**: กรมอุตุนิยมวิทยาไทย (Thai Meteorological Department)
- **Type**: พยากรณ์อากาศรายวัน
- **Endpoint**: `/forecast/location/daily/place` (ระบุชื่อสถานที่)

## การสมัครใช้งาน

### 1. สมัครสมาชิก
1. เข้าไปที่ [TMD API Portal](https://data.tmd.go.th/nwpapi/)
2. สมัครสมาชิกด้วยอีเมล
3. ยืนยันอีเมล

### 2. สร้าง OAuth Access Token
1. เข้าสู่ระบบ
2. ไปที่หน้า "API Access"
3. สร้าง Access Token ใหม่
4. คัดลอก Token

### 3. ตั้งค่า Environment Variables
สร้างไฟล์ `.env.local` ในโฟลเดอร์ root:

```bash
# TMD API Key
NEXT_PUBLIC_TMD_API_KEY=your_access_token_here
```

## ข้อมูลที่ได้รับจาก API

### ตัวแปรหลัก
- **tc_max**: อุณหภูมิสูงสุด (°C)
- **tc_min**: อุณหภูมิต่ำสุด (°C)
- **rh**: ความชื้นสัมพัทธ์ (%)
- **rain**: ปริมาณฝน (mm)
- **cloudlow**: เมฆระดับต่ำ (%)
- **cloudmed**: เมฆระดับกลาง (%)
- **cloudhigh**: เมฆระดับสูง (%)
- **ws10m**: ความเร็วลมที่ 10m (m/s)
- **wd10m**: ทิศทางลมที่ 10m (degree)

### การคำนวณ
- **อุณหภูมิเฉลี่ย**: (tc_max + tc_min) / 2
- **เมฆรวม**: (cloudlow + cloudmed + cloudhigh) / 3
- **ความเร็วลม**: ws10m * 1.94 (แปลงเป็น knots)

## ตัวอย่างการใช้งาน

### API Endpoint
```
GET https://data.tmd.go.th/nwpapi/v1/forecast/location/daily/place?province=ตรัง&amphoe=เมืองตรัง&tambon=ทับเที่ยง&fields=tc_max,tc_min,rh,rain,cloudlow,cloudmed,cloudhigh,ws10m,wd10m,cond&duration=1&subarea=0
```

### Headers
```
accept: application/json
authorization: Bearer YOUR_ACCESS_TOKEN
```

### Response Example
```json
{
  "weather_forecast": {
    "locations": [
      {
        "location": {
          "province": "ตรัง",
          "amphoe": "เมืองตรัง",
          "tambon": "ทับเที่ยง",
          "areatype": "tambon",
          "region": "S",
          "geocode": "920101",
          "lat": 7.559,
          "lon": 99.611
        },
        "forecasts": [
          {
            "time": "2024-01-15T00:00:00+07:00",
            "data": {
              "tc_max": 35,
              "tc_min": 28,
              "rh": 65,
              "rain": 0,
              "cloudlow": 20,
              "cloudmed": 10,
              "cloudhigh": 5,
              "ws10m": 3.2,
              "wd10m": 180,
              "cond": "clear"
            }
          }
        ]
      }
    ]
  }
}
```

## การจำกัดการใช้งาน
- **Rate Limit**: ตามที่ TMD กำหนด
- **Cache**: 30 นาที (อัปเดตทุก 30 นาที)
- **Fallback**: ใช้ข้อมูลจำลองหาก API ไม่พร้อม

## การแก้ไขปัญหา

### 1. API Key ไม่ถูกต้อง
- ตรวจสอบ Token ใน `.env.local`
- ตรวจสอบ Token หมดอายุหรือไม่

### 2. ข้อมูลไม่แสดง
- ตรวจสอบ Network tab ใน Developer Tools
- ดู Console logs สำหรับ error messages

### 3. ข้อมูลไม่ถูกต้อง
- ตรวจสอบ API response format
- ตรวจสอบการ parse ข้อมูลใน weatherService.js

## หมายเหตุ
- API นี้เป็นของกรมอุตุนิยมวิทยาไทย
- ข้อมูลอัปเดตทุก 30 นาที
- ใช้ได้เฉพาะในประเทศไทย
- ต้องมี Access Token ที่ถูกต้อง
- รองรับการระบุตำแหน่งแบบละเอียด (จังหวัด/อำเภอ/ตำบล)
- มีข้อมูลสภาพอากาศจาก TMD (cond field)

## ฟีเจอร์ใหม่
- **ระบุตำแหน่งละเอียด**: จังหวัด/อำเภอ/ตำบล
- **ข้อมูลสภาพอากาศ**: จาก TMD condition codes
- **ไอคอนที่แม่นยำ**: ตามสภาพอากาศจริง
- **คำอธิบายภาษาไทย**: ตามมาตรฐาน TMD
