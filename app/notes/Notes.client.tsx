"use client";

import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";

import { fetchNotes } from "../../lib/api";

import SearchBox from "../../components/SearchBox/SearchBox";
import NoteList from "../../components/NoteList/NoteList";
import Modal from "../../components/Modal/Modal";
import NoteForm from "../../components/NoteForm/NoteForm";
import Pagination from "../../components/Pagination/Pagination";

const PER_PAGE = 12;

export default function NotesClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search,
      }),
    placeholderData: keepPreviousData,
  });

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    handleSearch(value);
  };

  if (isLoading && !data) {
    return <p>Loading, please wait...</p>;
  }

  if (isError) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return (
    <>
      <SearchBox
        value={inputValue}
        onChange={handleSearchChange}
      />

      <button type="button" onClick={() => setIsModalOpen(true)}>
        Create note
      </button>

      <NoteList notes={data.notes} />

      {data.totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </>
  );
}