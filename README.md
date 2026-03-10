# TechStore - Shopping Cart & AI Chat Support (Lab 4, 5 & 6)

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
- **Đăng ký (Register):** Đăng ký tài khoản mới với Email, Mật khẩu và xác nhận mật khẩu. Có validation đầy đủ (độ dài tối thiểu, kiểm tra khớp mật khẩu).
- **Đăng nhập (Login):** Hỗ trợ đăng nhập bằng **Email/Mật khẩu** hoặc **Google OAuth** (nút "Tiếp tục với Gmail").
- **Hiện/Ẩn mật khẩu:** Nút toggle icon 👁️ (Eye/EyeOff từ Lucide React) trên tất cả các ô nhập mật khẩu ở cả trang Login và Register.
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

### 5. Trợ lý ảo AI (Lab 6)

- **Floating Chat Widget:** Cửa sổ chat nổi (popup) nhỏ gọn, hỗ trợ khách hàng mọi lúc từ bất kỳ trang nào.
- **Tích hợp Gemini AI:** Sử dụng model `gemini-1.5-flash` để trả lời thông minh về thông tin sản phẩm, giá cả và hình ảnh.
- **Real-time Messaging:** Đồng bộ tin nhắn tức thì qua **Supabase Realtime**. Tin nhắn được lưu trữ bền vững trong bảng `messages`.
- **Markdown Rendering:** AI trả lời với định dạng Markdown chuyên nghiệp, có thể hiển thị ảnh sản phẩm trực tiếp trong khung chat.

## 🛠️ Công nghệ sử dụng

- **Frontend Framework:** React 19 (với Vite)
- **Styling:** Tailwind CSS v4, thư viện UI ShadCN
- **Routing:** React Router DOM v7
- **Backend as a Service (BaaS):** Supabase (Auth & PostgreSQL Database)
- **AI Engine:** Google Gemini API (`@google/generative-ai`)
- **Markdown:** `react-markdown`
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
VITE_GEMINI_API_KEY=your_google_gemini_api_key
```

_(Lưu ý: Thay thế các giá trị trên bằng thông tin Project thật của bạn do Supabase cấp)._

> **Cấu hình Google OAuth:** Để tính năng đăng nhập Google hoạt động, vào **Supabase Dashboard → Authentication → Providers → Google** và bật Google provider lên, sau đó điền `Client ID` và `Client Secret` từ Google Cloud Console. Nhớ thêm URL callback của Supabase vào danh sách "Authorized redirect URIs" trong Google Cloud Console.

### Bước 4: Chạy môi trường phát triển (Dev Server)

```bash
npm run dev
```

Dự án sẽ khởi chạy tại `http://localhost:5173`.

## 🗄️ Cấu trúc Database (Supabase)

### 1. Bảng `orders` (Lab 4+5)

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

### 2. Bảng `messages` (Lab 6)

```sql
create table public.messages (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  content text not null,
  sender_type text not null check (sender_type in ('user', 'ai')),
  created_at timestamp with time zone not null default now(),
  constraint messages_pkey primary key (id),
  constraint messages_user_id_fkey foreign key (user_id) references auth.users (id) on update cascade on delete cascade
) tablespace pg_default;

-- Nhớ bật Realtime cho bảng messages trong Supabase Dashboard (Database -> Replication)
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

## 🔄 Changelog

### Cập nhật gần nhất

- ✅ **Lab 6 - AI Chat Widget:** Chuyển đổi từ trang Chat riêng biệt sang dạng Floating Widget nổi trên toàn dự án.
- ✅ **Gemini 1.5 Flash:** Tích hợp trí tuệ nhân tạo để tư vấn sản phẩm, tự động hiển thị ảnh sản phẩm thật của shop.
- ✅ **Real-time Messages:** Lưu trữ và đồng bộ lịch sử trò chuyện theo thời gian thực cho từng User.
- ✅ **Trang Register hoàn chỉnh:** Thêm trường xác nhận mật khẩu (`confirmPassword`) với validation.
- ✅ **Password Visibility Toggle:** Thêm nút hiện/ẩn mật khẩu (icon Eye/EyeOff) vào tất cả các ô input mật khẩu trên trang **Login** và **Register** (bao gồm cả ô xác nhận mật khẩu).
- ✅ **Google OAuth Login:** Tích hợp nút "Tiếp tục với Gmail" trên trang Login, sử dụng `supabase.auth.signInWithOAuth` để đăng nhập qua tài khoản Google.

## 👩‍💻 Tác giả

- Sinh viên phát triển dự án thực hành môn học.
