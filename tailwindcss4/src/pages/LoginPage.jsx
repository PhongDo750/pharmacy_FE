import {useState} from 'react';
import {useNavigate } from 'react-router-dom';
import {AuthenticationService} from "../services/authentication/AuthenticationService";
import { toast } from "react-toastify";
import { initWebSocket } from "../services/websocket/WebSocketService";

const LoginPage = () => {
    const [formData, setFormData] = useState({
      username: "",
      password: ""
    })

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();

    const authService = new AuthenticationService();

    const handleChangeFormData = (event) => {
      const { name, value } = event.target;
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSignIn = async (e) => {
        e.preventDefault();

        setLoading(true);

        const result = await tryLogIn(authService, formData);

        if (result.success) {
            // Khởi tạo WebSocket ngay sau khi đăng nhập thành công
            initWebSocket();
            setTimeout(() => {
                navigate("/home")
            }, 1000);
        }

        setLoading(false);
    };


    return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>
        <form onSubmit={handleSignIn}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Tên đăng nhập</label>
            <input
              type="text"
              name='username'
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tên đăng nhập"
              onChange={handleChangeFormData}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              name='password'
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mật khẩu"
              onChange={handleChangeFormData}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
      </form>
    </div>
  </div>

  );
}

async function tryLogIn(authService, formData) {
    try {
        console.log("formdata", formData)
        const { success, data, message } = await authService.logIn(formData);
        return { success: true};
    } catch (error) {
        console.error('[ERROR] Sign in failed', error);
        toast.error(error.message);
        return { success: false };
    }
}

// function redirectAfterFadeOut(navigate, role) {
//     if (role) {
//         navigate(DefaultRoleBaseRoutes(role));
//     }
// }

export default LoginPage;