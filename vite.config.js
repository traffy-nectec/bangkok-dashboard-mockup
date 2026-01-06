import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// หมายเหตุ: base "/" คือค่า default สำหรับรัน local หรือ domain หลัก
// หากต้องการนำขึ้น GitHub Pages ให้เปลี่ยน "/bangkok-dashboard-mockup/" เป็นชื่อ repository ของคุณ
// เช่น base: "/my-repo-name/"
export default defineConfig({
  plugins: [react()],
  base: "/bangkok-dashboard-mockup/", 
})