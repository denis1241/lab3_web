'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const MapWithNoSSR = dynamic(
  () => import('../../components/MapComponent'),
  { ssr: false, loading: () => <p>Загрузка карты...</p> }
);

// Тип для владельца
interface Owner {
  id: number;
  name: string;
  animal: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  email: string;
}

export default function OwnersPage() {
  const [owners, setOwners] = React.useState<Owner[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedOwner, setSelectedOwner] = React.useState<Owner | null>(null);

  React.useEffect(() => {
    fetch('/owners.json')
      .then(res => res.json())
      .then((data: Owner[]) => {
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
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link href="/" style={{
          display: 'inline-block',
          padding: '8px 16px',
          backgroundColor: '#6c757d',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px'
        }}>
          ← Назад на главную
        </Link>
      </div>
      
      <h1 style={{ textAlign: 'center' }}>Местоположение хозяев животных</h1>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '280px' }}>
          <h2>Список хозяев</h2>
          {owners.map((owner: Owner) => (
            <div 
              key={owner.id} 
              onClick={() => setSelectedOwner(owner)}
              style={{
                border: selectedOwner?.id === owner.id ? '2px solid #007bff' : '1px solid #ccc',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '10px',
                backgroundColor: selectedOwner?.id === owner.id ? '#e3f2fd' : '#f9f9f9',
                cursor: 'pointer'
              }}
            >
              <h3 style={{ margin: '0 0 5px 0' }}>{owner.name}</h3>
              <p style={{ margin: '5px 0' }}><strong>Животное:</strong> {owner.animal}</p>
              <p style={{ margin: '5px 0' }}><strong>Адрес:</strong> {owner.address}</p>
              <p style={{ margin: '5px 0' }}><strong>Телефон:</strong> {owner.phone}</p>
            </div>
          ))}
        </div>
        
        <div style={{ flex: '2', minWidth: '400px' }}>
          <h2>Карта местоположений</h2>
          <MapWithNoSSR owners={owners} selectedOwner={selectedOwner} setSelectedOwner={setSelectedOwner} />
          {selectedOwner && (
            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
              <p><strong>Выбран:</strong> {selectedOwner.name} — {selectedOwner.address}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}