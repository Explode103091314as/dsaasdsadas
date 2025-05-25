import { useNavigate } from 'react-router-dom';

function LandingPage({ setUser }) {
  const navigate = useNavigate();

  const handleDiscordLogin = () => {
    // Redirect to Discord OAuth (handled by backend)
    window.location.href = 'http://localhost:5000/auth/discord';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Welcome to BioLink</h1>
        <p className="text-lg mb-6">Create your custom bio page and share files securely!</p>
        <button
          onClick={handleDiscordLogin}
          className="bg-white text-blue-500 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200"
        >
          Sign in with Discord
        </button>
        <p className="mt-4">
          Already have an account?{' '}
          <a href="/dashboard" className="underline">Go to Dashboard</a>
        </p>
      </div>
    </div>
  );
}

export default LandingPage;
