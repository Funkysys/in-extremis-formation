interface ProfileFormFieldsProps {
  fullName: string;
  email: string;
  description: string;
  onFullNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export function ProfileFormFields({
  fullName,
  email,
  description,
  onFullNameChange,
  onDescriptionChange,
}: ProfileFormFieldsProps) {
  return (
    <>
      <div>
        <label className="block text-slate-700 font-medium mb-1">
          Nom complet
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>
      <div>
        <label className="block text-slate-700 font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          disabled
          className="input input-bordered w-full bg-slate-100"
        />
      </div>
      <div>
        <label className="block text-slate-700 font-medium mb-1">
          Description
        </label>
        <textarea
          className="textarea textarea-bordered w-full min-h-[80px]"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Décris-toi en quelques mots..."
        />
      </div>
    </>
  );
}
