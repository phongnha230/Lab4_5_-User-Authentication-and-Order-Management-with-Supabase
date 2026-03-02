import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
// Import trọn bộ nhà Card vào đây
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password.length < 6) {
      alert("Mật khẩu phải dài hơn 6 ký tự bạn ơi! 🛡️");
      setLoading(false); // Nhớ tắt loading để user sửa rồi bấm lại được nhé
      return; // Dừng hàm luôn, không chạy xuống đoạn gọi Supabase bên dưới
    }

    if (!email || !password) {
      alert("Điền đầy đủ thông tin vào đã chứ bạn ơi! 😅");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp rồi bạn ơi! Kiểm tra lại nhé 🧐");
      setLoading(false);
      return;
    }

    // Gọi API Đăng ký của Supabase
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      alert("Ối dồi ôi lỗi rồi: " + error.message);
    } else {
      alert("Đăng ký thành công! Chuyển hướng sang trang đăng nhập nhé 🚀");
      navigate("/login");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Tạo tài khoản mới
          </CardTitle>
          <CardDescription className="text-center">
            Nhập email và mật khẩu bên dưới để tham gia nha
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="grid gap-4">
            <div className="grid gap-2">
              <Input
                type="email"
                placeholder="Nhập email của bạn..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2 relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu (ít nhất 6 ký tự)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="grid gap-2 relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? "Đang tạo tài khoản..." : "Đăng Ký Ngay"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Đăng nhập ở đây
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
