'use client';

import React from 'react';
import { ThreeDots } from 'react-loader-spinner';

export default function Content() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {loading ? (
        <ThreeDots color="#00BFFF" height={80} width={80} />
      ) : (
        <div>
          <h1>Контент загружен!</h1>
          <p>Это страница content с индикатором загрузки</p>
        </div>
      )}
    </div>
  );
}