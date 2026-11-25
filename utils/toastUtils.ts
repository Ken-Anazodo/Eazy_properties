import { toast } from "sonner";

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      className: "alert alert-success",
      style: {
        backgroundColor: "#d4edda",
        color: "#155724",
        border: "1px solid #c3e6cb",
        borderRadius: "4px",
        padding: "10px",
      },
    });
  },
  error: (message: string) => {
    toast.error(message, {
      className: "alert alert-danger",
      style: {
        backgroundColor: "#f8d7da",
        color: "#721c24",
        border: "1px solid #f5c6cb",
        borderRadius: "4px",
        padding: "10px",
      },
    });
  },
  warning: (message: string) => {
    toast(message, {
      className: "alert alert-warning",
      style: {
        backgroundColor: "#fff3cd",
        color: "#856404",
        border: "1px solid #ffeeba",
        borderRadius: "4px",
        padding: "10px",
      },
    });
  },
};
