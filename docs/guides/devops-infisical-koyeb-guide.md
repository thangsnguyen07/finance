# Hướng Dẫn Vận Hành DevOps & Production Deployment (0đ Trọn Đời)

Tài liệu này hướng dẫn chi tiết từng bước (step-by-step) cách cấu hình, bảo mật và vận hành hệ thống Finance trên môi trường Cloud Production hoàn toàn miễn phí, an toàn tuyệt đối và chuẩn Enterprise.

---

## 1. Tổng Quan Kiến Trúc Production (Cloud 24/7)

```
                     ┌────────────────────────────────────────┐
                     │          Infisical (SecretOps)         │
                     │  - Project: "finance"                  │
                     │  - Paths: /backend  &  /frontend       │
                     └───────┬────────────────────────┬───────┘
                             │ (Sync / Fetch)         │ (Sync / Fetch)
                             ▼                        ▼
┌──────────────────┐    HTTPS / REST     ┌────────────────────────┐    SSL (pgbouncer)   ┌─────────────────────┐
│  Mobile Browser  │ ──────────────────► │     Koyeb (Backend)    │ ───────────────────► │ Supabase PostgreSQL │
│   / Desktop Web  │                     │  - NestJS Dockerfile   │                      │  - Singapore Region │
│  (Next.js App)   │                     │  - Port 4000 (0.0.0.0) │                      │  - Pooler Port 6543 │
│  Hosted: Vercel  │                     │  - Nano Instance 24/7  │                      │  - 500MB Free Tier  │
└──────────────────┘                     └────────────────────────┘                      └─────────────────────┘
```

| Dịch vụ       | Vai trò                               | Gói dịch vụ                     | Chi phí | Lý do lựa chọn                                                                          |
| :------------ | :------------------------------------ | :------------------------------ | :------ | :-------------------------------------------------------------------------------------- |
| **Supabase**  | PostgreSQL 16 + Connection Pooler     | Free Tier (Singapore)           | **0đ**  | Không kén thẻ ngân hàng VN, latency thấp (<30ms về VN), có sẵn PgBouncer.               |
| **Koyeb**     | Backend Hosting (NestJS Docker)       | Free Nano Tier (Frankfurt/Wash) | **0đ**  | **Chạy 24/7 không bao giờ ngủ gật** (khác với Render ngủ sau 15 phút).                  |
| **Vercel**    | Frontend Hosting (Next.js Standalone) | Hobby Tier (Global Edge CDN)    | **0đ**  | CDN siêu tốc, tối ưu cho Next.js, deploy qua GitHub Actions CLI.                        |
| **Infisical** | Secret Management (E2EE Vault)        | Free Cloud / CLI                | **0đ**  | Chuẩn Enterprise SOC2, loại bỏ hoàn toàn việc commit file `.env`, hỗ trợ Zero-File dev. |

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

### 3.1. Tạo Project và Cấu trúc Scopes

1. Đăng ký tài khoản miễn phí tại [app.infisical.com](https://app.infisical.com).
2. Tạo project mới đặt tên là `finance`.
3. Trong project, tạo 2 thư mục (folder paths):
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

| Key                                 | Môi trường Dev          | Môi trường Prod                  | Mô tả               |
| :---------------------------------- | :---------------------- | :------------------------------- | :------------------ |
| `PORT`                              | `3000`                  | `3000`                           | Port Next.js        |
| `NEXT_PUBLIC_API_URL`               | `http://localhost:4000` | `https://your-backend.koyeb.app` | URL gọi API Backend |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_test_...`           | `pk_live_...`                    | Public Key xác thực |
| `CLERK_SECRET_KEY`                  | `sk_test_...`           | `sk_live_...`                    | Secret Key xác thực |

### 3.3. Sử dụng Infisical CLI cho Local Dev (Zero-File)

Cài đặt Infisical CLI trên máy tính của bạn:

- **Windows (Scoop)**: `scoop install infisical`
- **Windows (Choco)**: `choco install infisical`
- **Hoặc tải installer**: [infisical.com/docs/cli/overview](https://infisical.com/docs/cli/overview)

Đăng nhập và liên kết dự án:

```bash
infisical login
infisical init # Chọn project 'finance'
```

Khởi chạy ứng dụng không cần file `.env`:

```bash
# Chạy Backend với secret tự động inject vào bộ nhớ:
infisical run --path=/backend -- pnpm dev:backend

# Chạy Frontend với secret tự động inject:
infisical run --path=/frontend -- pnpm dev:frontend
```

---

## 4. Quy Trình Chạy TypeORM Migrations An Toàn

Trong môi trường Enterprise (Option 5B), **Migrations luôn được chạy trước khi deploy container mới** (Pre-deploy hook) để tránh xung đột hoặc treo kết nối DB khi nhiều container khởi động đồng thời.

### 4.1. Lệnh Quản Lý Migration Trong Codebase

Các script đã được tích hợp sẵn trong `backend/package.json`:

- `pnpm --filter backend migration:run`: Chạy các file migration chưa được áp dụng (sử dụng TypeScript qua `tsx` trên môi trường dev).
- `pnpm --filter backend migration:run:prod`: Chạy migration từ thư mục `dist/` đã build (dùng trong CI/CD pipeline).
- `pnpm --filter backend migration:revert`: Hoàn tác (rollback) migration gần nhất.
- `pnpm --filter backend migration:generate -n <MigrationName>`: Tự động so sánh Entity với Database hiện tại để sinh file migration mới.

### 4.2. Chạy Migration lên Supabase thủ công lần đầu

Trước khi ứng dụng backend chạy trên Koyeb, bạn có thể chạy initial migration lên Supabase bằng lệnh:

```bash
# Cách 1: Sử dụng Infisical để inject DATABASE_URL của Supabase
infisical run --env=prod --path=/backend -- pnpm --filter backend migration:run

# Cách 2: Thiết lập biến môi trường trực tiếp trong PowerShell
$env:DATABASE_URL="postgresql://postgres.[ref]:[pass]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
$env:DATABASE_SSL="true"
pnpm --filter backend migration:run
```

---

## 5. Thiết Lập Koyeb Hosting Cho Backend (NestJS)

Koyeb cung cấp 1 Nano instance miễn phí 24/7 không sleep, hỗ trợ trực tiếp Dockerfile và tự cấp phát chứng chỉ HTTPS tự động.

1. Đăng ký tài khoản miễn phí tại [koyeb.com](https://www.koyeb.com).
2. Bấm **Create App** -> Chọn **GitHub** làm deployment source.
3. Chọn repo `finance` và cấu hình:
   - **Deployment method**: `Dockerfile`.
   - **Dockerfile location**: `backend/Dockerfile`.
   - **Build context**: `.` (Thư mục gốc monorepo, để đọc `pnpm-workspace.yaml` và `pnpm-lock.yaml`).
   - **Exposed port**: `4000` (Giao thức HTTP).
4. Thêm các biến môi trường (hoặc cấu hình Infisical Native Integration vào Koyeb):
   - `NODE_ENV`: `production`
   - `PORT`: `4000`
   - `DATABASE_URL`: Chuỗi kết nối Supabase
   - `DATABASE_SSL`: `true`
   - `FRONTEND_URL`: URL Vercel của bạn (ví dụ: `https://your-finance.vercel.app`)
5. Bấm **Deploy**. Sau 2-3 phút, Koyeb sẽ cấp phát domain có dạng: `https://<app-name>-<org>.koyeb.app`.
6. Kiểm tra Swagger UI bằng cách truy cập: `https://<your-koyeb-app>.koyeb.app/api/docs`.

---

## 6. Thiết Lập Vercel Cho Frontend (Next.js Standalone)

Next.js đã được cấu hình chế độ `output: 'standalone'` trong `frontend/next.config.ts`, tối ưu hóa kích thước build chỉ chứa đúng những file cần thiết để chạy.

1. Đăng ký tài khoản tại [vercel.com](https://vercel.com).
2. Tạo project mới liên kết với repository `finance`:
   - **Root Directory**: Chọn `frontend`.
   - **Build Command**: `pnpm build`
   - **Output Directory**: Mặc định Next.js
3. Khai báo biến môi trường trên Vercel Dashboard:
   - `NEXT_PUBLIC_API_URL`: Điền URL Backend từ Koyeb (`https://<your-koyeb-app>.koyeb.app`).
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Key từ Clerk dashboard.
4. Bấm **Deploy**. Vercel sẽ phân phối frontend lên Edge CDN toàn cầu (bao gồm POP tại Singapore).

---

## 7. Kiểm Thử Hệ Thống Với Docker Compose

Dự án áp dụng mô hình phân tầng Compose chuẩn chính thức của Docker:

```
├── docker-compose.yml           # Base: Khai báo service postgres, network, volumes
├── docker-compose.override.yml  # Local Dev: Tự động nạp, expose port 5432 ra host máy tính
└── docker-compose.prod.yml      # Mirror Prod: Đóng gói cả frontend, backend và DB nội bộ
```

### 7.1. Chế độ Local Development Hàng Ngày (Hybrid DX)

Khởi động database PostgreSQL trong Docker và chạy app trên máy thật (Hot-Reload tức thì):

```bash
# 1. Khởi động PostgreSQL container
docker compose up -d

# 2. Chạy ứng dụng trên máy thật (cả 2 song song)
pnpm dev

# Hoặc chạy riêng lẻ:
pnpm dev:backend
pnpm dev:frontend
```

### 7.2. Chế độ Kiểm Thử Toàn Diện Chuẩn Production (Full Mirror)

Để kiểm tra hành vi của Dockerfile, build standalone và network production ngay trên máy trước khi push:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

- Frontend sẽ chạy tại: `http://localhost:3000`
- Backend API sẽ chạy tại: `http://localhost:4000`
- Database sẽ được cô lập hoàn toàn bên trong mạng ảo `finance-network` không mở port ra host ngoài.

Để dừng toàn bộ containers:

```bash
docker compose down
```

---

## 8. Checklist Bảo Mật & Chi Phí 0đ

- [x] Không bao giờ commit file `.env` hay credentials vào git (`.dockerignore` và `.gitignore` đã chặn hoàn toàn).
- [x] Mọi kết nối tới Cloud Database đều được mã hóa bằng TLS/SSL (`DATABASE_SSL=true`).
- [x] Backend NestJS bind địa chỉ `0.0.0.0` để tương thích môi trường container hóa.
- [x] CORS được cấu hình chặt chẽ, chỉ cho phép domain Frontend được chỉ định và các URL Vercel preview.
- [x] Cơ chế Layered Docker Compose tuân thủ chuẩn Docker, tách biệt hoàn toàn giữa dev và prod.
- [x] Toàn bộ hạ tầng Supabase, Koyeb, Vercel và Infisical vận hành 100% trong hạn mức miễn phí vĩnh viễn (0đ trọn đời).
