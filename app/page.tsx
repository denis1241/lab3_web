'use client';

import React from 'react';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import 'react-awesome-slider/dist/captioned.css';

// Стили для карточки животного
const animalCardStyle = {
  position: 'relative' as const,
  width: '100%',
  height: '500px',
  overflow: 'hidden'
};

const imageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover' as const
};

const textOverlayStyle = {
  position: 'absolute' as const,
  bottom: '0',
  left: '0',
  right: '0',
  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
  color: 'white',
  padding: '30px 20px 20px 20px',
  textAlign: 'center' as const
};

const headerStyle = {
  fontSize: '32px',
  margin: '0 0 10px 0',
  textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
};

const contentStyle = {
  fontSize: '18px',
  margin: '0',
  textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
};

function sendEmail(email: string) {
  const user = typeof window !== 'undefined' ? localStorage.getItem('user') : '';
  const body = `Здравствуйте, я нашел вашего питомца.%0A-----------%0AС уважением, ${user}`;
  window.open(`mailto:${email}?subject=Потерянный зверь&body=${body}`);
}

interface AnimalData {
  header: string;
  content: string;
  img: string;
  email: string;
}

function Animal(props: { data: AnimalData }) {
  if (!props.data) return <p>Loading</p>;
  const { header, content, img } = props.data;
  
  return (
    <div style={animalCardStyle}>
      <img
        style={imageStyle}
        src={img}
        alt={header}
      />
      <div style={textOverlayStyle}>
        <h1 style={headerStyle}>{header}</h1>
        <p style={contentStyle}>{content}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const [animals, setAnimals] = React.useState<AnimalData[]>([]);

  React.useEffect(() => {
    fetch('/animals.json')
      .then(data => data.json())
      .then(data => setAnimals(data));
  }, []);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      let user = localStorage.getItem('user');
      if (user === null) {
        while (user === null) {
          user = prompt("Введите ваше имя пользователя");
          if (!user) {
            alert('Обязательно!');
          } else {
            localStorage.setItem('user', user);
          }
        }
      }
    }
  }, []);

  function logout() {
    localStorage.clear();
    window.location.reload();
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <button onClick={logout} style={{ position: 'absolute', top: 10, right: 10, zIndex: 20, padding: '8px 16px', cursor: 'pointer' }}>logout</button>
      <h1 style={{ textAlign: 'center', paddingTop: '20px', margin: 0 }}>Petto</h1>
      
      {/* Скрываем стандартные кружочки слайдера и поднимаем кнопки навигации */}
      <style>{`
        .aws-sld__bullets {
          display: none !important;
        }
        .aws-sld__controls {
          z-index: 15 !important;
        }
        .aws-sld__wrapper {
          z-index: 1 !important;
        }
      `}</style>
      
      <AwesomeSlider style={{ "--slider-height-percentage": "60%" }}>
        {animals.map((data, i) => (
          <div key={i} onClick={() => sendEmail(data?.email)}>
            <Animal data={data} />
          </div>
        ))}
      </AwesomeSlider>
      
      <footer style={{ textAlign: 'center', padding: '20px', position: 'relative', zIndex: 10, backgroundColor: '#f5f5f5' }}>
        Petto, (c) 2026
      </footer>
      
      <div style={{ textAlign: 'center', margin: '20px', position: 'relative', zIndex: 10 }}>
        <a href="/owners" style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px'
        }}>
          Посмотреть местоположение хозяев
        </a>
      </div>
    </div>
  );
}