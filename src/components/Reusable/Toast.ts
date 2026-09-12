import Swal, { SweetAlertIcon } from "sweetalert2";

interface Toast {
  icon: SweetAlertIcon;
  title: string;
}

export const Toast = ({ icon, title }: Toast) => {
  return Swal.fire({
    toast: true,
    position: "top-end",
    icon,
    title,
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
  });
};
