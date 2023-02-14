import * as Toastr from "toastr";
import "toastr/build/toastr.css";

export function customSuccessNotification(msg = "Success!") {
  Toastr.success(msg);
}

export function customErrorNotification(msg = "Error!") {
  Toastr.error(msg);
}

export function apiErrorNotification(error) {
  console.log(error.request);
  Toastr.error(error?.response?.data?.message ?? "Some problem occurred.");
}
