import React from 'react';

const ImageDebug = () => {
  const testImages = [
    'https://source.unsplash.com/800x400/?paris',
    'https://source.unsplash.com/600x400/?eiffel+tower',
    'https://source.unsplash.com/400x300/?louvre+museum',
    'https://source.unsplash.com/300x200/?tokyo+tower',
    'https://source.unsplash.com/400x300/?travel+activity'
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>🧪 Image Debug Test</h2>
      <p>Testing if Unsplash images are loading...</p>
      
      {testImages.map((url, index) => (
        <div key={index} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <p><strong>Test Image {index + 1}:</strong></p>
          <p style={{ fontSize: '12px', color: '#666' }}>{url}</p>
          <img 
            src={url}
            alt={`Test ${index + 1}`}
            style={{ width: '200px', height: '150px', objectFit: 'cover' }}
            onLoad={() => console.log(`✅ Image ${index + 1} loaded successfully`)}
            onError={(e) => {
              console.log(`❌ Image ${index + 1} failed to load`);
              e.target.style.border = '2px solid red';
            }}
          />
        </div>
      ))}
      
      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f0f0f0' }}>
        <h3>🔍 Debug Instructions:</h3>
        <ol>
          <li>Open browser console (F12)</li>
          <li>Look for image load success/failure messages</li>
          <li>Check if images appear above</li>
          <li>If images don't load, there might be a network issue</li>
        </ol>
      </div>
    </div>
  );
};

export default ImageDebug;