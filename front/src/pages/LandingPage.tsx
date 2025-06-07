export default function LandingPage() {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <a href="/" className="btn btn-ghost text-xl">
          Drivix
        </a>
      </div>

      <div className="navbar-end">
        <a href="/login" className="btn bg-blue-600 text-white">
          Sign in
        </a>
      </div>
    </div>
  );
}
