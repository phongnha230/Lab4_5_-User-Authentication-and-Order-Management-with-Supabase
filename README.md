# TechStore - Shopping Cart with Authentication (Lab 4+5)

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

Ứng dụng web mua sắm trực tuyến cơ bản được phát triển bằng React (Vite). Dự án này kết hợp các chức năng giỏ hàng, xác thực người dùng và lưu trữ dữ liệu bằng **Supabase**.

## 🚀 Tính năng nổi bật

### 1. Public Home Page

- Hiển thị danh sách sản phẩm (TechStore) với giao diện đẹp mắt bằng Tailwind CSS + ShadCN UI.
- Cho phép người dùng chưa đăng nhập xem sản phẩm và thêm vào giỏ hàng (Local State).

### 2. Xác thực người dùng (Authentication)

- Tích hợp **Supabase Auth** để quản lý người dùng.
- **Đăng ký (Register):** Đăng ký tài khoản mới với Email và Mật khẩu.
- **Đăng nhập (Login):** Người dùng yêu cầu đăng nhập trước khi tiến hành thanh toán.
- **Đăng xuất (Logout):** Xóa session an toàn trên mọi thiết bị.
- **Protected Routes:** Các trang như Giỏ hàng (Checkout) và Lịch sử mua hàng được bảo vệ, tự động điều hướng người chưa đăng nhập về trang Đăng nhập.

### 3. Quản lý giỏ hàng (Shopping Cart)

- Quản lý giỏ hàng toàn cục thông qua `CartContext`.
- Tăng/giảm số lượng sản phẩm, hoặc xóa từng sản phẩm riêng lẻ.
- Xóa toàn bộ giỏ hàng với 1 click.

### 4. Quản lý Đơn hàng (Order Management)

- Sau khi bấm "Thanh toán", dữ liệu đơn hàng được lưu lên bảng `orders` của **Supabase Database**.
- Thông tin lưu trữ bao gồm: `user_id`, `total_price`, danh sách `items`, và `created_at`.
- Giỏ hàng tự động được làm sạch sau khi thanh toán thành công.
- Trang **Lịch sử đơn hàng** hiển thị toàn bộ các giao dịch đã thực hiện theo tài khoản đang đăng nhập.

## 🛠️ Công nghệ sử dụng

- **Frontend Framework:** React 19 (với Vite)
- **Styling:** Tailwind CSS v4, thư viện UI ShadCN
- **Routing:** React Router DOM v7
- **Backend as a Service (BaaS):** Supabase (Auth & PostgreSQL Database)
- **Icon:** Lucide React

## 📦 Cài đặt và chạy dự án (Local Development)

### Bước 1: Clone Repository

```bash
git clone https://github.com/phongnha230/Lab4_5_-User-Authentication-and-Order-Management-with-.git
cd lab4_5
```

### Bước 2: Cài đặt Dependencies

```bash
npm install
```

### Bước 3: Cấu hình biến môi trường (Environment Variables)

Tạo tệp `.env` ở thư mục gốc của dự án (`/lab4_5/.env`) và điền các khóa API của Supabase:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

_(Lưu ý: Thay thế các giá trị trên bằng thông tin Project thật của bạn do Supabase cấp)._

### Bước 4: Chạy môi trường phát triển (Dev Server)

```bash
npm run dev
```

Dự án sẽ khởi chạy tại `http://localhost:5173`.

## 🗄️ Cấu trúc Database (Supabase)

Để dự án hoạt động tốt, bạn cần tạo bảng `orders` trong CSDL Supabase với Schema gợi ý sau:

```sql
create table public.orders (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  total_price numeric not null,
  status text null default 'pending'::text,
  items jsonb not null,
  created_at timestamp with time zone not null default now(),
  constraint orders_pkey primary key (id),
  constraint orders_user_id_fkey foreign KEY (user_id) references auth.users (id) on update cascade on delete cascade
) tablespace pg_default;
```

## 📐 Kiến trúc thư mục (Folder Structure)

```
src/
├── assets/          # Hình ảnh tĩnh (hình sản phẩm)
├── components/      # Các component tái sử dụng (ShadCN, ProtectedRoute,...)
├── context/         # AuthContext và CartContext (Global State)
├── lib/             # Các thư viện utils (Supabase config, Tailwind merge)
├── page/            # Các trang chính (Home, Cart, Login, Register, OrderHistory)
├── App.jsx          # Component Layout (Header, Footer, Router Outlet)
└── main.jsx         # Entry point (Router Provider)
```

## 👩‍💻 Tác giả

- Sinh viên phát triển dự án thực hành môn học.
