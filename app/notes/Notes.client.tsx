"use client";

import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";

import { fetchNotes } from "../../lib/api";

import SearchBox from "../../components/SearchBox/SearchBox";
import NoteList from "../../components/NoteList/NoteList";
import Modal from "../../components/Modal/Modal";
import NoteForm from "../../components/NoteForm/NoteForm";
import Pagination from "../../components/Pagination/Pagination";

import css from "./Notes.module.css";

const PER_PAGE = 12;

export default function NotesClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, search],

    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search,
      }),

    placeholderData: keepPreviousData,

    refetchOnMount: false,
  });

  const handleSearch = useDebouncedCallback(
    (value: string) => {
      setSearch(value);
      setPage(1);
    },
    500
  );

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    handleSearch(value);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (isError) {
    throw new Error("Could not fetch the list of notes.");
  }

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <main className={css.main}>
      <div className={css.container}>
        <div className={css.top}>
          <h1 className={css.title}>Notes</h1>

          <button
            type="button"
            className={css.createButton}
            onClick={() => setIsModalOpen(true)}
          >
            Create note +
          </button>
        </div>

        <SearchBox
          value={inputValue}
          onChange={handleSearchChange}
        />

        <NoteList notes={notes} />

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {isModalOpen && (
        <Modal onClose={handleModalClose}>
          <h2>Create note</h2>

          <NoteForm onSuccess={handleModalClose} />
        </Modal>
      )}
    </main>
  );
}