// Composant: ProfileFormFields - Champs du formulaire de profil

import { FRANCOPHONE_COUNTRIES } from "@/lib/admin/francophone-countries";

interface ProfileFormFieldsProps {
  form: {
    fullName: string;
    zipCode: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  };
  email: string;
  formError: string;
  phoneError: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export const ProfileFormFields = ({
  form,
  email,
  formError,
  phoneError,
  onChange,
}: ProfileFormFieldsProps) => {
  return (
    <>
      <div>
        <label className="block mb-1 font-semibold">Email</label>
        <input
          type="email"
          name="email"
          value={email}
          disabled
          className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">
          Nom complet <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={onChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        {formError && (
          <div className="text-error text-sm mt-1">{formError}</div>
        )}
      </div>
      <div>
        <label className="block mb-1 font-semibold">Code postal</label>
        <input
          type="text"
          name="zipCode"
          value={form.zipCode}
          onChange={onChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Téléphone</label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={onChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="ex: +33612345678"
        />
        {phoneError && (
          <div className="text-error text-sm mt-1">{phoneError}</div>
        )}
      </div>
      <div>
        <label className="block mb-1 font-semibold">Adresse</label>
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={onChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Ville</label>
        <input
          type="text"
          name="city"
          value={form.city}
          onChange={onChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Pays</label>
        <select
          name="country"
          value={form.country}
          onChange={onChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Sélectionner un pays</option>
          {FRANCOPHONE_COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};
