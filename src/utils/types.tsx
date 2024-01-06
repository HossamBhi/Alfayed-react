export type productProps = {
  id: number;
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
  total: string;
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