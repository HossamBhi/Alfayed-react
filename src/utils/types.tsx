import { trasactionsEnums } from "./enums";

export type productProps = {
  productID: number;
  id?: number;
  name: string;
  productUnitPrice: number;
  productNote: string;
  created_Date: Date | string;
};

export type supplierProps = {
  id: number;
  name: string;
  total: string;
  date?: Date | string;
};

export type employeeProps = {
  id: number;
  name: string;
  salary: string;
  date?: Date | string;
};

export type supplierDataProps = {
  carNumber: string;
  created_Date: null | Date;
  discount: Number;
  farmsID: Number;
  farmsName: String;
  farmsNotes: String;
  netQuantity: null | number;
  paied: number;
  price: number;
  productID: number;
  productName: String;
  quantity: number;
  remaining: Number;
  supplyDate: Date;
  total: number;
};
export type expenseProps = {
  id: number;
  name: string;
  total: string;
  date?: Date | string;
};
export type expenseTypesProps = {
  id: number;
  name: string;
};

export type clientProps = {
  id: number;
  name: string;
  total: string;
  date?: Date | string;
};

export type accountsProps = {
  total: string;
};

export type stockProps = {
  notes: string;
  productID: number;
  productName: string;
  quantity: number;
};

export type fridgeProps = {
  id: number;
  name: string;
  total: string;
  date?: Date | string;
};

export type fridgeDataProps = {
  carNumber: string;
  created_Date: null | Date;
  discount: Number;
  farmsID: Number;
  farmsName: String;
  farmsNotes: String;
  netQuantity: null | number;
  paied: number;
  price: number;
  productID: number;
  productName: String;
  quantity: number;
  remaining: Number;
  supplyDate: Date;
  total: number;
};

export type transactionProps = {
  clientID: null;
  clientName: string;
  date: Date;
  empID: number;
  empName: string;
  expenseID: null;
  expenseName: string;
  farmID: null;
  farmName: string;
  fridgeID: null;
  fridgeName: string;
  id: number;
  notes: string;
  safeID: number;
  total: string | number;
  type: string;
  typeID: trasactionsEnums;
};
export type productListProps = {
  id: number;
  productID: number;
  productName?: string;
  productBoxID: number;
  productBoxName?: string;
  quantity: string;
  number: string;
  price: string;
  total: string;
  isNew: boolean;
};

export type clientRowProps = {
  clientID: string | number;
  clientName: string;
  driverName: "";
  deliveredToDriver: number;
  date: string;
  typeId: 0;
  total: 0;
  carCapacity: 0;
  payed: number;
  notes: "";
  payDate: string;
  productList: productListProps[];
};
