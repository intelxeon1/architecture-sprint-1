import React from "react";

const AuthRemote = import('AuthApp/Auth')
const CardsRemote = import('CardsApp/Cards')
const ProfileRemote = import('ProfileApp/Profile')

function App() {
  return (
    <div className="page__content">
      <AuthRemote>
      </AuthRemote>
      <CardsRemote>
      </CardsRemote>
      <ProfileRemote>
      </ProfileRemote>
    </div>
  );
}

export default App;
