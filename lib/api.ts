import axios from "axios";

import type { CreateNoteData, Note } from "../types/note";

const API_URL = "https://notehub-public.goit.study/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export async function fetchNotes({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<NotesResponse> {
  const response = await api.get<NotesResponse>("/notes", {
    params: {
      page,
      perPage,
      search,
    },
  });

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${id}`);

  return response.data;
}

export async function createNote(data: CreateNoteData): Promise<Note> {
  const response = await api.post<Note>("/notes", data);

  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await api.delete<Note>(`/notes/${id}`);

  return response.data;
}