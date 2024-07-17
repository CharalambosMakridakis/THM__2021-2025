import MediaCard from '../components/Garage/MediaCard.tsx';

// import pb from '../lib/pocketbase.ts';

export default function Garage() {
  const dummyLogin = true;
  if (dummyLogin) {
  }
  const data = [
    {
      carName: 'Mercedes Sprinter',
      carSeats: 4,
      cargoSpaceLitre: 500,
      cargoSpaceKilogram: 500,
      carImage: 'https://img.autrado.de/240/330274_1920.jpg',
    },
    {
      carName: 'VW Golf',
      carSeats: 5,
      cargoSpaceLitre: 25,
      cargoSpaceKilogram: 50,
      carImage:
        'https://cdn.motor1.com/images/mgl/P3WEQy/s3/volkswagen-golf-gti-380-2023.jpg',
    },
    {
      carName: 'Aston Martin Valkyrie',
      carSeats: 2,
      cargoSpaceLitre: 3,
      cargoSpaceKilogram: 10,
      carImage:
        'https://www.autoscout24.de/cms-content-assets/6WsOhn7W6IBq5tPeSYTPx6-fd33502c4ef4778b93aa6e4bc32d6d48-aston-martin-valkyrie-frontansicht-1100.jpg',
    },
  ];

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        {data.map((item, index) => (
          <MediaCard
            key={index}
            carName={item.carName}
            carSeats={item.carSeats}
            cargoSpaceLitre={item.cargoSpaceLitre}
            cargoSpaceKilogram={item.cargoSpaceKilogram}
            carImage={item.carImage}
          />
        ))}
      </div>
    </>
  );
}
