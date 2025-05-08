export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Mon Profil</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Détails du profil</h2>
        <p>Contenu de votre profil ici...</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">
            Informations personnelles
          </h3>
          <ul className="space-y-2">
            <li>Nom: John Doe</li>
            <li>Email: johndoe@email.com</li>
            <li>Téléphone: +123456789</li>
          </ul>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">{`Historique d'achat`}</h3>
        <ul className="space-y-2">
          <li>Achat 1</li>
          <li>Achat 2</li>
          <li>Achat 3</li>
        </ul>
      </div>
    </div>
  );
}
