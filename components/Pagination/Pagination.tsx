"use client";

import ReactPaginate from "react-paginate";

import styles from "./Pagination.module.css";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const handlePageChange = ({
    selected,
  }: {
    selected: number;
  }) => {
    onPageChange(selected + 1);
  };

  return (
    <ReactPaginate
      pageCount={totalPages}
      onPageChange={handlePageChange}
      forcePage={page - 1}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      previousLabel="←"
      nextLabel="→"
      breakLabel="..."
      containerClassName={styles.pagination}
      activeClassName={styles.active}
      disabledClassName={styles.disabled}
      pageClassName={styles.page}
      previousClassName={styles.previous}
      nextClassName={styles.next}
    />
  );
}