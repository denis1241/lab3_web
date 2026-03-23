'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Исправляем иконки маркеров в Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

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

  // Центр карты (Пенза)
  const center: [number, number] = [53.195, 45.000];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <p>Загрузка данных...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>Местоположение хозяев животных</h1>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Список слева */}
        <div style={{ flex: '1', minWidth: '280px' }}>
          <h2>Список хозяев</h2>
          {owners.map(owner => (
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
        
        {/* Карта справа */}
        <div style={{ flex: '2', minWidth: '400px' }}>
          <h2>Карта местоположений</h2>
          <MapContainer 
            center={selectedOwner ? [selectedOwner.lat, selectedOwner.lng] : center} 
            zoom={13} 
            style={{ height: '500px', width: '100%', borderRadius: '8px' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {owners.map(owner => (
              <Marker 
                key={owner.id} 
                position={[owner.lat, owner.lng]}
                eventHandlers={{
                  click: () => setSelectedOwner(owner)
                }}
              >
                <Popup>
                  <strong>{owner.name}</strong><br />
                  Животное: {owner.animal}<br />
                  Адрес: {owner.address}<br />
                  Телефон: {owner.phone}<br />
                  Email: {owner.email}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
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
