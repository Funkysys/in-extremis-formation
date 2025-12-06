import { ProfileField } from "./ProfileField";

interface User {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  role?: { name: string };
}

interface ProfileDisplayProps {
  user: User;
}

export function ProfileDisplay({ user }: ProfileDisplayProps) {
  return (
    <div className="space-y-3">
      <ProfileField
        label="Nom"
        value={user?.fullName}
        defaultText="Non renseigné"
      />
      <ProfileField
        label="Email"
        value={user?.email}
        defaultText="Non renseigné"
      />
      <ProfileField
        label="Téléphone"
        value={user?.phone}
        defaultText="Non renseigné"
      />
      <ProfileField
        label="Adresse"
        value={user?.address}
        defaultText="Non renseignée"
      />
      <ProfileField
        label="Ville"
        value={user?.city}
        defaultText="Non renseignée"
      />
      <ProfileField
        label="Code postal"
        value={user?.zipCode}
        defaultText="Non renseigné"
      />
      <ProfileField
        label="Pays"
        value={user?.country}
        defaultText="Non renseigné"
      />
      {user?.role && (
        <p>
          <strong>Rôles:</strong> {user.role.name}
        </p>
      )}
    </div>
  );
}
