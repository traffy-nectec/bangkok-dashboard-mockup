# React + Vite Project

โครงการนี้คือ **mockup สำหรับแสดง dashboard ข้อมูล Traffy Fondue ของ กทม. ในมิติต่างๆ**

โครงการนี้เป็น React project ที่สร้างขึ้นด้วย Vite ซึ่งมีการตั้งค่าพื้นฐานสำหรับ React พร้อม Hot Module Replacement (HMR) และกฎ ESLint บางส่วน

## วิธีการใช้งาน (Local Setup)

หากต้องการใช้งานโปรเจกต์นี้บนเครื่องของคุณ ให้ทำตามขั้นตอนด้านล่าง:

1.  **โคลน Repository:**
    เปิด Terminal หรือ Command Prompt แล้วใช้คำสั่ง:
    ```bash
    git clone <URL_ของ_Repository>
    ```
    (โปรดแทนที่ `<URL_ของ_Repository>` ด้วย URL จริงของ Git repository นี้)

2.  **เข้าสู่ Directory ของโปรเจกต์:**
    ```bash
    cd bangkok-dashboard-mockup
    ```

3.  **ติดตั้ง Dependencies:**
    ติดตั้งแพ็คเกจที่จำเป็นทั้งหมดโดยใช้ npm:
    ```bash
    npm install
    ```

4.  **รัน Development Server:**
    เริ่มเซิร์ฟเวอร์สำหรับการพัฒนา (Development Server) เพื่อดูแอปพลิเคชันของคุณในโหมดพัฒนา:
    ```bash
    npm run dev
    ```
    โดยปกติแล้ว แอปพลิเคชันจะเปิดขึ้นมาที่ `http://localhost:5173` (หรือพอร์ตอื่น ๆ ที่ระบุไว้)

5.  **สร้าง Production Build:**
    หากต้องการสร้างเวอร์ชันสำหรับ Production (Optimized และพร้อมสำหรับการ Deploy):
    ```bash
    npm run build
    ```

6.  **พรีวิว Production Build (ทางเลือก):**
    หลังจากสร้าง Production Build แล้ว คุณสามารถพรีวิวเวอร์ชัน Production ได้:
    ```bash
    npm run preview
    ```
