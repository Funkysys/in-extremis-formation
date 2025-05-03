import CourseCard from "@/components/formationUi/CourseCard";
import FormationMenu from "@/components/formationUi/FormationMenu";
import HorizontalMenu from "@/components/formationUi/HorizontalMenu";
import Pagination from "@/components/formationUi/Pagination";
import SearchAndFilter from "@/components/formationUi/SearchAndFilter";
import temp_video_data from "@/data/temp_video";

const FormationPage = () => {
  return (
    <div className="min-h-[100vh] bg-sky-900 text-slate-100 overflow-y-hidden ">
      <div className="w-full p-6 border-b border-slate-200 flex justify-between">
        <h1 className="text-4xl font-roboto">{`Découvrez toutes nos formations`}</h1>
        <HorizontalMenu />
      </div>
      <FormationMenu />
      <SearchAndFilter />
      <div className="flex flex-col items-center">
        <CourseCard temp_video_data={temp_video_data} />
        <Pagination />
      </div>
    </div>
  );
};

export default FormationPage;
