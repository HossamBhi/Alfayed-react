import {
  Clients,
  Expenses,
  FarmsAndFarmers,
  Statistics,
} from "../components/dashboard";

const Home = () => {
  return (
    <main className="flex min-h-screen flex-col">
      <Statistics />

      <div className="grid grid-cols-1 gap-4 p-2 md:p-4 lg:grid-cols-3">
        <FarmsAndFarmers />
        <Expenses />
        <Clients />
      </div>
    </main>
  );
};

export default Home;
