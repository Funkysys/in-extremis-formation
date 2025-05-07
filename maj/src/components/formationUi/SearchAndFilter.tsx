import temp_formation_data from "@/data/temp_formation";
const SearchAndFilter = () => {
  return (
    <div className="join text-slate-900 w-full flex justify-center items-center py-4 ">
      <div>
        <div>
          <input
            className="input join-item bg-slate-100 text-slate-900"
            placeholder="Rechercher"
          />
        </div>
      </div>
      <select className="select join-item bg-slate-100 text-slate-900">
        <option disabled defaultValue={"Filtres"}>
          {`Filtres`}
        </option>
        {temp_formation_data.map((formation) => (
          <option key={formation.id} value={formation.id}>
            {formation.title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchAndFilter;
