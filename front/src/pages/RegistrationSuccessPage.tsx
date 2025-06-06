export default function RegistrationSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="bg-base-100 shadow-xl rounded-xl p-10 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-success">✅ Registration Successful</h1>
        <p className="text-base text-base-content">
          Please check your email to verify your account before logging in.
        </p>
        <a href="/login" className="btn bg-blue-600 mt-6">Go to Login</a>
      </div>
    </div>
  );
}
