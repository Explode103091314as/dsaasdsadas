import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard({ user }) {
  const navigate = useNavigate();
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState({ name: '', url: '', icon: '' });
  const [theme, setTheme] = useState('default');
  const [files, setFiles] = useState([]);
  const [analytics, setAnalytics] = useState({ views: 0, referrers: {} });

  useEffect(() => {
    if (!user) navigate('/');
    // Fetch user data
    fetch('http://localhost:5000/api/users/me', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setLinks(data.links || []);
        setTheme(data.theme || 'default');
        setFiles(data.files || []);
      });

    // Fetch analytics
    fetch('http://localhost:5000/api/analytics/me', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => res.json())
      .then((data) => setAnalytics(data));
  }, [user, navigate]);

  const addLink = () => {
    fetch('http://localhost:5000/api/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(newLink),
    })
      .then((res) => res.json())
      .then((data) => setLinks([...links, data]));
    setNewLink({ name: '', url: '', icon: '' });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    fetch('http://localhost:5000/api/files/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => setFiles([...files, data]));
  };

  const updateTheme = () => {
    if (!user.isPremium) {
      alert('Premium feature: Upgrade to customize themes!');
      return;
    }
    fetch('http://localhost:5000/api/users/theme', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ theme }),
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Manage Links</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Link Name"
              value={newLink.name}
              onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="URL"
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Icon (e.g., 🐦)"
              value={newLink.icon}
              onChange={(e) => setNewLink({ ...newLink, icon: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={addLink}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Add Link
            </button>
          </div>
          <ul className="mt-4 space-y-2">
            {links.map((link, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{link.icon} {link.name}</span>
                <button
                  onClick={() => {
                    fetch(`http://localhost:5000/api/links/${link._id}`, {
                      method: 'DELETE',
                      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    }).then(() => setLinks(links.filter((_, i) => i !== index)));
                  }}
                  className="text-red-500"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Upload Files</h2>
          <input
            type="file"
            onChange={handleFileUpload}
            className="w-full p-2 border rounded"
          />
          <ul className="mt-4 space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
                <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  View
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Customize Theme</h2>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={!user?.isPremium}
          >
            <option value="default">Default</option>
            <option value="dark">Dark</option>
            <option value="gradient">Gradient</option>
          </select>
          <button
            onClick={updateTheme}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Save Theme
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Analytics</h2>
          <p>Total Views: {analytics.views}</p>
          <p>Top Referrer: {analytics.referrers.top || 'None'}</p>
        </div>
      </div>
      <div className="mt-6 text-center">
        <a
          href={user?.isPremium ? '#' : '/upgrade'}
          className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
        >
          {user?.isPremium ? 'Premium User' : 'Upgrade to Premium'}
        </a>
      </div>
    </div>
  );
}

export default Dashboard;
