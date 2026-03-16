'use client';

import React from 'react';

export default function OwnersPage() {
  const [owners, setOwners] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/owners.json')
      .then(res => res.json())
      .then(data => {
        setOwners(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <p>Загрузка данных...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>Местоположение хозяев животных</h1>
      
      {owners.map(owner => (
        <div key={owner.id} style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '15px',
          backgroundColor: '#f9f9f9'
        }}>
          <h2>{owner.name}</h2>
          <p><strong>Животное:</strong> {owner.animal}</p>
          <p><strong>Адрес:</strong> {owner.address}</p>
          <p><strong>Телефон:</strong> {owner.phone}</p>
          <p><strong>Email:</strong> {owner.email}</p>
        </div>
      ))}
    </div>
  );
}