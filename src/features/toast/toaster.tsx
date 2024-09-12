import { Toaster as RhtToaster } from "react-hot-toast";

export const Toaster = () => {
  return (
    <RhtToaster
      containerStyle={{ position: "sticky" }}
      toastOptions={{
        position: "bottom-center",
        style: {
          backgroundColor: "#333",
          color: "white",
          fontWeight: 600,
        },
      }}
    />
  );
};
