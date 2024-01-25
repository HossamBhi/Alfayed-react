export const DOMAIN = "https://alfayedfarm.somee.com";
export const API_URL = DOMAIN + "/";

export const AUTH = {
  login: "Login"
}

export const SUPPLIERS = {
  getAll: "GetAllFarms",
  getById: "GetFarmById",
  add: "AddFarm",
  update: "UpdateFarm",
  getDetails: "GetAllFarmsRecords",
  addRecord: "AddFarmRecord",
  getAllRecords: "GetAllFarmRecords",
  getRecord: "GetFarmRecord",
  updateRecord: "UpdateFarmRecord",
  getTotalRemaining: "GetTotalRemaining",
  getRecordWithData: "GetFarmRecordWithData",
  pay: "PayToFarm",
};

export const CLIENT = {
  getAll: "GetAllClients",
  add: "AddClient",
  update: "UpdateClient",
  getById: "GetClientById",
  addRecord: "AddTransaction",
  updateRecord: "UpdateFarmRecord",
  getRecordWithData: "GetTransactionsWithClientData",
  getRecord: "GetTransactionRecordByID",
  pay: "CollectMoneyFromClient",
};

export const EXPENSES = {
  getAll: "GetAllExpenses",
  getById: "GetExpenseById",
  add: "AddExpense",
  update: "UpdateExpense",
  addRecord: "AddExpenseRecord",
  getRecordById: "GetExpenseRecordById",
  updateRecord: "UpdateExpenseRecord",
  getExpensesForFarmRecord: "GetExpensesForFarmRecord",
  getExpensesWithData: "GetExpensesWithData",
  pay: "PayToExpense",
};
export const EXPENSES_TYPE = {
  getAll: "GetAllExpensetypes",
  getById: "GetExpenseById",
  add: "AddExpenseType",
  update: "UpdateExpense",
};

export const PRODUCTS = {
  getAll: "GetAllProducts",
  add: "AddNewProduct",
  update: "UpdateProduct",
  getAllDetails: "AllProductsDetails",
};

export const STORE = {
  getAll: "GetStoreProducts",
  setProductQtyToZero: "SetProductQtyToZero",
};

export const ACCOUNTS = {
  getTotal: "GetTotalbalance",
  addBalance: "AddBalanceToSafe",
  getAll: "GetRecords",
};

export const EMPLOYEES = {
  getAll: "GetAllEmployees",
  getById: "GetEmployee",
  add: "AddEmployee",
  update: "UpdateEmployee",
  pay: "PayToEmployee",
};

export const FRIDGES = {
  getAll: "GetAllFridges",
  getById: "GetFridgeById",
  add: "AddFridge",
  update: "UpdateFridge",
  getDetails: "GetAllFridgeRecords",
  addRecord: "AddFridgeRecord",
  getAllRecords: "GetAllFarmRecords",
  getRecord: "GetFridgeRecord",
  updateRecord: "UpdateFridgeRecord",
  getTotalRemaining: "GetTotalRemaining",
  getRecordWithData: "GetFridgeRecordsWithData",
  pay: "PayToFridge",
};
