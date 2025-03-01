
import * as yup from "yup";

export const bookSchema = yup.object({
  title: yup.string().required("Title is required").min(3, "Title must be at least 3 characters"),
  author: yup.string().required("Author is required").min(3, "Author name must be at least 3 characters"),
  year: yup.number().required("Year is required").min(1000, "Year must be valid").max(new Date().getFullYear(), "Year cannot be in the future"),
});
