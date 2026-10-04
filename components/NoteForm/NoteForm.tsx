"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

import { createNote } from "../../lib/api";

interface NoteFormProps {
  onClose: () => void;
}

interface NoteFormValues {
  title: string;
  content: string;
  tag: string;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters"),

  content: Yup.string()
    .trim()
    .max(500, "Content must be at most 500 characters")
    .notRequired(),

  tag: Yup.string()
    .required("Tag is required")
    .oneOf(
      ["Todo", "Work", "Personal", "Meeting", "Shopping"],
      "Invalid tag",
    ),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["notes"],
      });

      onClose();
    },
  });

  const initialValues: NoteFormValues = {
    title: "",
    content: "",
    tag: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        mutation.mutate({
          title: values.title,
          content: values.content || undefined,
          tag: values.tag,
        });
      }}
    >
      <Form>
        <div>
          <label htmlFor="title">Title</label>

          <Field
            id="title"
            name="title"
            type="text"
            placeholder="Enter note title"
          />

          <ErrorMessage name="title" component="p" />
        </div>

        <div>
          <label htmlFor="content">Content</label>

          <Field
            id="content"
            name="content"
            as="textarea"
            placeholder="Enter note content"
          />

          <ErrorMessage name="content" component="p" />
        </div>

        <div>
          <label htmlFor="tag">Tag</label>

          <Field id="tag" name="tag" as="select">
            <option value="">Select tag</option>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>

          <ErrorMessage name="tag" component="p" />
        </div>

        {mutation.isError && <p>{mutation.error.message}</p>}

        <div>
          <button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Creating..." : "Create note"}
          </button>

          <button type="button" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </button>
        </div>
      </Form>
    </Formik>
  );
}