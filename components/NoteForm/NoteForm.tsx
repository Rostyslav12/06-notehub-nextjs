"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createNote } from "../../lib/api";

import css from "./NoteForm.module.css";

interface NoteFormProps {
  onSuccess: () => void;
}

export default function NoteForm({
  onSuccess,
}: NoteFormProps) {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("Todo");

  const mutation = useMutation({
    mutationFn: createNote,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });

      setTitle("");
      setContent("");
      setTag("Todo");

      onSuccess();
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      return;
    }

    mutation.mutate({
      title: title.trim(),
      content: content.trim(),
      tag,
    });
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <label className={css.label}>
        Title
        <input
          className={css.input}
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </label>

      <label className={css.label}>
        Content
        <textarea
          className={css.textarea}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          required
        />
      </label>

      <label className={css.label}>
        Tag
        <select
          className={css.input}
          value={tag}
          onChange={(event) => setTag(event.target.value)}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </label>

      {mutation.isError && (
        <p className={css.error}>
          Could not create note.
        </p>
      )}

      <button
        className={css.button}
        type="submit"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Creating..." : "Create note"}
      </button>
    </form>
  );
}