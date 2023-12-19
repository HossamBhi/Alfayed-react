import { useTranslation } from "react-i18next";
const Accounts = () => {
  const { t } = useTranslation();
  const searchQuiry = new URLSearchParams(window.location.search);

  return (
    <main className="flex min-h-screen flex-col p-2 md:p-4">
      <div className="grid grid-cols-1">{/* <CustomTable /> */}</div>
    </main>
  );
};

export default Accounts;
