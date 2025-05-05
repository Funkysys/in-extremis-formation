const SearchAndFilter = () => {
  return (
    <div className="join text-slate-900 w-full flex justify-center items-center py-4 ">
      <div>
        <div>
          <input
            className="input join-item bg-slate-100 text-slate-900"
            placeholder="Search"
          />
        </div>
      </div>
      <select className="select join-item bg-slate-100 text-slate-900">
        <option disabled defaultValue={"Filter"}>
          Filter
        </option>
        <option>Sci-fi</option>
        <option>Drama</option>
        <option>Action</option>
      </select>
    </div>
  );
};

export default SearchAndFilter;
