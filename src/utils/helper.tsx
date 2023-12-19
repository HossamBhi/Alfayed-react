import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { BsInboxes, BsInboxesFill } from "react-icons/bs";
import { FaUserTie } from "react-icons/fa";
import { GiFarmer, GiFruitTree, GiPayMoney } from "react-icons/gi";
import { MdAddCircle, MdAddCircleOutline } from "react-icons/md";
import { RiBankFill, RiBankLine } from "react-icons/ri";

export const SIDEMENU_LINKS = [
  {
    title: "homepage",
    url: "/",
    InActiveIcon: AiOutlineHome,
    ActiveIcon: AiFillHome,
  },
  {
    title: "products",
    url: "/products",
    InActiveIcon: GiFruitTree,
    ActiveIcon: GiFruitTree,
  },
  {
    title: "addToStock",
    url: "/add-to-stock",
    InActiveIcon: MdAddCircleOutline,
    ActiveIcon: MdAddCircle,
  },
  {
    title: "farmsAndFarmers",
    url: "/suppliers",
    InActiveIcon: GiFarmer,
    ActiveIcon: GiFarmer,
  },
  {
    title: "expenses",
    url: "/expenses",
    InActiveIcon: GiPayMoney,
    ActiveIcon: GiPayMoney,
  },
  {
    title: "clients",
    url: "/clients",
    InActiveIcon: FaUserTie,
    ActiveIcon: FaUserTie,
  },
  {
    title: "stock",
    url: "/stock",
    InActiveIcon: BsInboxes,
    ActiveIcon: BsInboxesFill,
  },

  {
    title: "accounts",
    url: "/accounts",
    InActiveIcon: RiBankLine,
    ActiveIcon: RiBankFill,
  },
];

export const createDataColumns = (
  data: { [key: string]: any },
  t: (s: string) => void,
): {
  field: string;
  headerName: string;
  width: number;
  headerAlign: "center";
  align: "center";
}[] => {
  if (!data) {
    return [];
  }
  const keys = Object?.keys(data);
  const result = keys.reduce((prev: any, curr) => {
    return [
      ...prev,
      ...[
        {
          field: curr,
          headerName: t(curr + "") + "",
          width: curr.indexOf("ID") > 0 ? 80 : 120,
          headerAlign: "center",
          align: "center",
        },
      ],
    ];
  }, []);
  return result;
};

export const formatDate = (date: Date) => {
  // "2023-11-16"
  const d = new Date(date);
  return `${d.toISOString().substring(0, 10)}`;
  // return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};
