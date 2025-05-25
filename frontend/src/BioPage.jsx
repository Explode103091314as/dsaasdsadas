import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function BioPage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Fetch user profile from backend
    fetch(`http://localhost:5000/api/users/${username}`)
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error(err));

    // Log analytics (simplified)
    fetch('http://localhost:5000/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, timestamp: new Date(), referrer: document.referrer }),
    });
  }, [username]);

  if (!profile) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 m-4">
      <div className="text-center">
        <img
          src={profile.avatar || 'https://via.placeholder.com/150'}
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
        <p className="text-gray-600 mb-6">{profile.bio}</p>
      </div>
      <div className="space-y-4">
        {profile.links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center py-2 px-4 rounded-lg transition duration-300 ${
              profile.isPremium ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-blue-500 text-white'
            } hover:bg-blue-600`}
          >
            <span className="mr-2">{link.icon}</span>
            <span>{link.name}</span>
          </a>
        ))}
        {profile.files && profile.files.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800">Files</h2>
            {profile.files.map((file, index) => (
              <a
                key={index}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-500 hover:underline mt-2"
              >
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </a>
            ))}
          </div>
        )}
      </div>
      <div className="text-center mt-6">
        <p className="text-gray-500 text-sm">
          Powered by <a href="/" className="text-blue-500 hover:underline">BioLink</a>
        </p>
      </div>
    </div>
  );
}

export default BioPage;
