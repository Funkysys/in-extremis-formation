export default function MaFormation() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Ma Formation</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Détails de la formation</h2>
        <p>Contenu de votre formation ici...</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Modules</h3>
          <ul className="space-y-2">
            <li>Module 1</li>
            <li>Module 2</li>
            <li>Module 3</li>
          </ul>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Ressources</h3>
          <ul className="space-y-2">
            <li>Resource 1</li>
            <li>Resource 2</li>
            <li>Resource 3</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
