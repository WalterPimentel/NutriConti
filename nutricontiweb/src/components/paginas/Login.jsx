import GoogleLogin from "../../auth/GoogleLogin";

const Login = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 p-6">
            <p className="text-white text-center drop-shadow-lg font-extrabold text-6xl mb-8 whitespace-nowrap overflow-hidden">
                NutriConti
                <span className="text-green-500">Web</span>
            </p>
            <div className="w-full max-w-xs p-6 hover:drop-shadow-xl bg-white rounded shadow-md">
                <h1 className='mb-4 text-center font-bold text-4xl text-gray-800'>Iniciar Sesión</h1>
                <GoogleLogin />
            </div>
        </div>
    );
};

export default Login;