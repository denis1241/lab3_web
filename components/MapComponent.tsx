'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// Исправляем стандартные иконки для Leaflet
export default function MapComponent({ owners, selectedOwner, setSelectedOwner }: any) {
  useEffect(() => {
    // Исправляем иконки только на клиенте
    if (typeof window !== 'undefined') {
      // @ts-ignore - игнорируем ошибку TypeScript
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });
    }
  }, []);

  // Определяем центр карты с правильным типом
  const center: [number, number] = selectedOwner 
    ? [selectedOwner.lat, selectedOwner.lng] 
    : [53.195, 45.000];

  return (
    <MapContainer 
      center={center}
      zoom={13} 
      style={{ height: '500px', width: '100%', borderRadius: '8px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {owners.map((owner: any) => (
        <Marker 
          key={owner.id} 
          position={[owner.lat, owner.lng] as [number, number]}
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
  );
}