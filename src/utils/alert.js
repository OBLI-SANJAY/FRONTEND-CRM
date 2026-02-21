import Swal from "sweetalert2";

export const showSuccess = (message) => {
    Swal.fire({
        icon: "success",
        title: "Success",
        text: message,
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
    });
};
export const showError = (message) => {
    Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
        confirmButtonColor: "#d33",
    });
};
export const showWarning = (message) => {
    Swal.fire({
        icon: "warning",
        title: "Warning",
        text: message,
        confirmButtonColor: "#f0ad4e",
    });
};
export const showConfirm = async (message, title = "Are you sure?") => {
    const result = await Swal.fire({
        icon: "warning",
        title: title,
        text: message,
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, proceed",
        cancelButtonText: "Cancel",
    });
    return result.isConfirmed;
};
export const showCalling = (name) => {
    Swal.fire({
        icon: "info",
        title: `📞 Calling ${name}...`,
        text: "Initiating call. Please wait.",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
    });
};
