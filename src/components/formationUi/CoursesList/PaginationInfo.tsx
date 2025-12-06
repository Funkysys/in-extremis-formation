interface PaginationInfoProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export function PaginationInfo({
  currentPage,
  itemsPerPage,
  totalItems,
}: PaginationInfoProps) {
  const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="mt-4 text-center text-sm text-slate-400">
      Affichage de {startItem} à {endItem} sur {totalItems} formations
    </div>
  );
}
