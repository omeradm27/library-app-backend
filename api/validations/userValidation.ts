import * as yup from "yup";

export const userSchema = yup.object({
  firstName: yup.string().required("First name is required").min(2, "First name must be at least 2 characters"),
  lastName: yup.string().required("Last name is required").min(2, "Last name must be at least 2 characters"),
  email: yup.string().email("Invalid email format").required("Email is required"),
});
