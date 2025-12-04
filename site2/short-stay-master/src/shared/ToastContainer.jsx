import { useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { useSelector } from "react-redux";

export default function ToastContainer() {
  const  { toastInfo }  = useSelector((state) => state?.common);
  const toast = useRef();
  useEffect(() => {
    if (toastInfo?.title) {
      toast.current.show({
        severity: toastInfo.type,
        summary: toastInfo.title,
        detail: toastInfo.detail,
        life: 3000,
      });
    }
  }, [toastInfo]);
  return (
    <>
      <Toast style={{ zIndex: "9999999999999" }} ref={toast} />
    </>
  );
}
