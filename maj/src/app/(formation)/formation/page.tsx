import CourseCard from "@/components/formationUi/CourseCard";
import FormationMenu from "@/components/formationUi/FormationMenu";
import HorizontalMenu from "@/components/formationUi/HorizontalMenu";
import Pagination from "@/components/formationUi/Pagination";
import SearchAndFilter from "@/components/formationUi/SearchAndFilter";
import Header from "@/components/formationUi/Header";

const FormationPage = () => {
  return (
    <div className="min-h-[100vh]  text-slate-100 overflow-y-hidden ">
      <Header />
      <FormationMenu />
      <SearchAndFilter />
      <div className="flex flex-col items-center">
        <CourseCard />
        <Pagination />
      </div>
    </div>
  );
};

export default FormationPage;
