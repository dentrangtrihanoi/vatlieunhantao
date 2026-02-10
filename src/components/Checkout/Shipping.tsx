import { useEffect } from "react";
import { useCheckoutForm } from "./form";

export default function Shipping() {
  const { setValue } = useCheckoutForm();

  // Force shipToDifferentAddress to false so it uses billing address
  useEffect(() => {
    setValue("shipToDifferentAddress", false);
  }, [setValue]);

  return null;
}
