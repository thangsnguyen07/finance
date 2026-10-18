# Hướng Dẫn Vận Hành DevOps & Production Deployment (0đ Trọn Đời)

Tài liệu này hướng dẫn chi tiết từng bước (step-by-step) cách cấu hình, bảo mật và vận hành hệ thống Finance trên môi trường Cloud Production hoàn toàn miễn phí, **không yêu cầu thẻ tín dụng/Visa quốc tế**, an toàn tuyệt đối và chuẩn Enterprise.

---

## 1. Tổng Quan Kiến Trúc Production (Cloud 24/7)

```
                     ┌────────────────────────────────────────┐
                     │          Infisical (SecretOps)         │
                     │  - Project: "finance"                  │
                     │  - Paths: /backend  &  /frontend       │
                     └───────┬────────────────────────┬───────┘
                             │ (Sync / Inject)        │ (Sync / Inject)
                             ▼                        ▼
┌──────────────────┐    HTTPS / REST     ┌────────────────────────┐    SSL (pgbouncer)   ┌─────────────────────┐
│  Mobile Browser  │ ──────────────────► │    Render.com (Backend)│ ───────────────────► │ Supabase PostgreSQL │
│   / Desktop Web  │                     │  - NestJS Dockerfile   │                      │  - Singapore Region │
│  (Next.js App)   │                     │  - Singapore Region    │                      │  - Pooler Port 6543 │
│  Hosted: Vercel  │                     │  - Port 4000 (0.0.0.0) │                      │  - 500MB Free Tier  │
└──────────────────┘                     └───────────▲────────────┘                      └─────────────────────┘
                                                     │ (Keep-Alive Ping 10 min)
                                         ┌───────────┴────────────┐
                                         │ UptimeRobot / Cron-Job │
                                         │  (0đ - Chống Sleep)    │
                                         └────────────────────────┘
```

| Dịch vụ          | Vai trò                               | Gói dịch vụ                  | Chi phí | Thẻ tín dụng? | Lý do lựa chọn                                                             |
| :--------------- | :------------------------------------ | :--------------------------- | :------ | :------------ | :------------------------------------------------------------------------- |
| **Supabase**     | PostgreSQL 16 + Connection Pooler     | Free Tier (Singapore)        | **0đ**  | **Không**     | Latency thấp (<30ms về VN), có sẵn PgBouncer, 500MB lưu trữ miễn phí.      |
| **Render.com**   | Backend Hosting (NestJS Docker)       | Free Web Service (Singapore) | **0đ**  | **Không**     | Hỗ trợ Region Singapore, build trực tiếp từ Dockerfile, tự động cấp HTTPS. |
| **Vercel**       | Frontend Hosting (Next.js Standalone) | Hobby Tier (Global Edge CDN) | **0đ**  | **Không**     | Edge CDN siêu tốc, tối ưu cho Next.js, phân phối toàn cầu.                 |
| **Infisical**    | Secret Management (E2EE Vault)        | Free Cloud / CLI             | **0đ**  | **Không**     | Chuẩn Enterprise SOC2, loại bỏ file `.env`, Zero-File dev.                 |
| **cron-job.org** | Keep-Alive Monitor                    | Free Forever                 | **0đ**  | **Không**     | Ping URL mỗi 10 phút giúp Render backend chạy 24/7 không bao giờ ngủ.      |

---

## 2. Thiết Lập Cơ Sở Dữ Liệu Supabase

1. Đăng ký tài khoản miễn phí tại [supabase.com](https://supabase.com).
2. Tạo Organization cá nhân và bấm **New Project**:
   - **Name**: `finance-db`
   - **Database Password**: Đặt mật khẩu mạnh (lưu lại vào password manager).
   - **Region**: Chọn **Singapore (`ap-southeast-1`)** để đạt tốc độ tối đa cho người dùng Việt Nam.
3. Khi project khởi tạo xong, truy cập **Project Settings** -> **Database**:
   - Cuộn xuống phần **Connection string**.
   - Chọn tab **URI** và chuyển sang chế độ **Transaction Pooler (Port 6543)** hoặc **Session Pooler (Port 5432)**.
   - Chuỗi kết nối có dạng:
     ```text
     postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
     ```

---

## 3. Thiết Lập Quản Lý Bí Mật Với Infisical (SecretOps)

Infisical đóng vai trò là "Single Source of Truth" cho toàn bộ secret của dự án, giúp máy local và CI/CD không cần lưu file `.env` chứa mật khẩu nhạy cảm.

### 3.1. Cấu trúc Scopes trong Project `finance`

Tạo 2 thư mục (folder paths):

- `/backend`: Dành riêng cho NestJS backend.
- `/frontend`: Dành riêng cho Next.js frontend.

### 3.2. Khai báo Secret vào Infisical

#### Thư mục `/backend`:

| Key            | Môi trường Dev                                             | Môi trường Prod                                                                                            | Mô tả                         |
| :------------- | :--------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------- | :---------------------------- |
| `NODE_ENV`     | `development`                                              | `production`                                                                                               | Môi trường chạy               |
| `PORT`         | `4000`                                                     | `4000`                                                                                                     | Port lắng nghe                |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/finance_db` | `postgresql://postgres.[ref]:[pass]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true` | Chuỗi kết nối DB              |
| `DATABASE_SSL` | `false`                                                    | `true`                                                                                                     | Bắt buộc bật SSL với Supabase |
| `FRONTEND_URL` | `http://localhost:3000`                                    | `https://your-frontend.vercel.app`                                                                         | CORS whitelist domain         |

#### Thư mục `/frontend`:

| Key                                 | Môi trường Dev          | Môi trường Prod                     | Mô tả                      |
| :---------------------------------- | :---------------------- | :---------------------------------- | :------------------------- |
| `PORT`                              | `3000`                  | `3000`                              | Port Next.js               |
| `BACKEND_API_URL`                   | `http://localhost:4000` | `https://your-backend.onrender.com` | URL Backend (Server Proxy) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_test_...`           | `pk_live_...`                       | Public Key xác thực        |
| `CLERK_SECRET_KEY`                  | `sk_test_...`           | `sk_live_...`                       | Secret Key xác thực        |

### 3.3. Sử dụng Infisical CLI cho Local Dev (Zero-File)

```bash
infisical login
infisical init # Liên kết project 'finance'

# Chạy Backend (PowerShell):
infisical run --env=dev --path=/backend -- pnpm dev:backend

# Chạy Backend (Git Bash - thêm 2 dấu gạch chéo //):
infisical run --env=dev --path=//backend -- pnpm dev:backend

# Chạy Frontend:
infisical run --env=dev --path=/frontend -- pnpm dev:frontend
```

---

## 4. Quy Trình Chạy TypeORM Migrations An Toàn

Trong môi trường Enterprise (Option 5B), **Migrations luôn được chạy trước khi deploy container mới** (Pre-deploy hook) để tránh xung đột hoặc treo kết nối DB.

### 4.1. Lệnh Quản Lý Migration

- `pnpm --filter backend migration:run`: Chạy migration chưa áp dụng (dùng TypeScript qua `tsx`).
- `pnpm --filter backend migration:run:prod`: Chạy migration từ thư mục `dist/` đã build.
- `pnpm --filter backend migration:revert`: Rollback migration gần nhất.
- `pnpm --filter backend migration:generate -n <MigrationName>`: Tự động so sánh Entity với Database để sinh migration mới.

### 4.2. Chạy Migration lên Supabase

```bash
# Trên PowerShell:
infisical run --env=prod --path=/backend -- pnpm --filter backend migration:run

# Trên Git Bash:
infisical run --env=prod --path=//backend -- pnpm --filter backend migration:run
```

---

## 5. Thiết Lập Render.com Cho Backend (NestJS)

Render cung cấp Web Service hoàn toàn miễn phí, hỗ trợ Dockerfile monorepo và đặc biệt có data center tại **Singapore**.

### 5.1. Tạo Web Service mới

1. Đăng ký/Đăng nhập tại [render.com](https://render.com) bằng tài khoản **GitHub**. (Hoàn toàn không hỏi thẻ tín dụng).
2. Tại Dashboard, bấm **New +** -> Chọn **Web Service**.
3. Chọn repository `finance` từ danh sách GitHub repositories của bạn.
4. Cấu hình dịch vụ:
   - **Name**: `finance-api` (hoặc tên tuỳ chọn).
   - **Region**: Chọn **Singapore (Southeast Asia)** (để kết nối tới Supabase Singapore siêu tốc <15ms).
   - **Branch**: `main` (hoặc `feat/infisical-docker-compose-setup`).
   - **Language / Runtime**: Chọn **Docker**.
   - **Dockerfile Path**: `./backend/Dockerfile`.
   - **Docker Context**: `.` (Dấu chấm - thư mục gốc monorepo để đọc lockfile).
   - **Instance Type**: Chọn **Free** ($0/month).

### 5.2. Khai báo Biến Môi trường (Environment Variables)

Bấm sang tab **Environment** hoặc mục **Environment Variables**:

- `PORT`: `4000`
- `NODE_ENV`: `production`
- `DATABASE_URL`: `postgresql://postgres.[ref]:[pass]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true`
- `DATABASE_SSL`: `true`
- `FRONTEND_URL`: Tạm thời để `http://localhost:3000` (lát nữa khi deploy Vercel xong sẽ điền URL Vercel vào).

### 5.3. Triển khai và Kiểm tra

5. Bấm **Create Web Service**.
6. Render sẽ pull code, build multi-stage Docker container và khởi động NestJS.
7. Khi build xong (hiển thị `Live`), Render sẽ cung cấp URL dạng:
   `https://finance-api-xxxx.onrender.com`
8. Kiểm tra API bằng cách mở trình duyệt truy cập:
   `https://finance-api-xxxx.onrender.com/api/docs` (Swagger UI).

### 5.4. Thiết Lập Giữ Thức 24/7 (Chống Sleep Miễn Phí)

Gói Free của Render sẽ tự động chuyển sang chế độ "ngủ" (spin down) nếu không có request sau 15 phút. Để giữ service chạy 24/7 không có cold start:

1. Đăng ký tài khoản miễn phí tại [cron-job.org](https://cron-job.org) hoặc [uptimerobot.com](https://uptimerobot.com).
2. Tạo một cron job mới:
   - **URL**: `https://finance-api-xxxx.onrender.com/api/docs`
   - **Schedule**: Mỗi **10 phút** một lần (`*/10 * * * *`).
3. Dịch vụ cron sẽ tự động "đánh thức" server đều đặn, đảm bảo bạn mở app trên điện thoại lúc nào cũng phản hồi tức thì 100%!

---

## 6. Thiết Lập Vercel Cho Frontend (Next.js Standalone)

Next.js đã được cấu hình chế độ `output: 'standalone'` trong `frontend/next.config.ts`.

1. Đăng ký tài khoản tại [vercel.com](https://vercel.com) bằng GitHub.
2. Tạo project mới liên kết với repository `finance`:
   - **Root Directory**: Chọn `frontend`.
   - **Build Command**: `pnpm build`
   - **Output Directory**: Mặc định Next.js
3. Khai báo biến môi trường trên Vercel Dashboard:
   - `BACKEND_API_URL`: Điền URL Backend từ Render (`https://finance-api-xxxx.onrender.com`).
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Key từ Clerk dashboard.
4. Bấm **Deploy**. Vercel sẽ phân phối frontend lên Edge CDN toàn cầu (bao gồm POP tại Singapore).
5. **Cập nhật ngược lại Render**: Copy domain của Vercel (ví dụ `https://finance-web.vercel.app`) và điền vào biến `FRONTEND_URL` trên Render dashboard.

---

## 7. Khởi Chạy Local Development Với Docker Compose

Để phục vụ môi trường phát triển cục bộ (Local Development) nhanh chóng mà không cần cài đặt PostgreSQL cồng kềnh lên hệ điều hành, dự án sử dụng duy nhất một file `docker-compose.yml` tinh gọn:

```bash
# 1. Khởi động PostgreSQL container chạy nền (port 5432)
docker compose up -d

# 2. Chạy ứng dụng song song trên máy thật với Hot-Reload tức thì
pnpm dev

# Hoặc khởi động riêng lẻ từng service:
pnpm dev:backend
pnpm dev:frontend

# 3. Khi kết thúc phiên làm việc, dừng container
docker compose down
```

> **Lưu ý kiến trúc Production**: Khi deploy lên Cloud (Render cho Backend và Vercel cho Frontend), hệ thống sử dụng trực tiếp `backend/Dockerfile` và Vercel Edge Runtime độc lập, **hoàn toàn không cần Docker Compose trên Production**.

---

## 8. Checklist Bảo Mật & Chi Phí 0đ

- [x] Không bao giờ commit file `.env` hay credentials vào git (`.dockerignore` và `.gitignore` đã chặn hoàn toàn).
- [x] Mọi kết nối tới Cloud Database đều được mã hóa bằng TLS/SSL (`DATABASE_SSL=true`).
- [x] Backend NestJS bind địa chỉ `0.0.0.0` để tương thích môi trường container hóa của Render.
- [x] CORS được cấu hình chặt chẽ, chỉ cho phép domain Frontend được chỉ định và các URL Vercel preview.
- [x] Docker Compose được tinh gọn tối đa cho Local Dev, trong khi Production deploy độc lập qua Dockerfile (Render) và Vercel.
- [x] Toàn bộ hạ tầng Supabase, Render, Vercel và Infisical vận hành **100% không cần thẻ tín dụng, 0đ trọn đời**.
