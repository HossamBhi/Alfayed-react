import { GridRenderCellParams } from "@mui/x-data-grid";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { BsInboxes, BsInboxesFill } from "react-icons/bs";
import { FaUserTie } from "react-icons/fa";
import { GiFarmer, GiFruitTree, GiPayMoney } from "react-icons/gi";
import { HiOutlineUserGroup, HiUserGroup } from "react-icons/hi";
import { MdAddCircle, MdAddCircleOutline } from "react-icons/md";
import {
  RiBankFill,
  RiBankLine,
  RiFridgeFill,
  RiFridgeLine,
} from "react-icons/ri";

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
    title: "fridges",
    url: "/fridges",
    InActiveIcon: RiFridgeLine,
    ActiveIcon: RiFridgeFill,
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
  {
    title: "employees",
    url: "/employees",
    InActiveIcon: HiOutlineUserGroup,
    ActiveIcon: HiUserGroup,
  },
];

export const createDataColumns = (
  data: { [key: string]: any },
  t: (s: string) => void
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
          renderCell: [
            "total",
            "salary",
            "quantity",
            "totalRemaining",
            "remaining",
            "paied",
            "additionalPrice",
            "price",
            "netQuantity",
            "payed",
          ].includes(curr)
            ? (props: GridRenderCellParams<any, Date>) => {
                const { row } = props;
                return <p>{row[curr] !== null ? convertNTCS(row[curr]) : ""}</p>;
              }
            : undefined,
        },
      ],
    ];
  }, []);
  return result;
};

export const formatDate = (date: Date) => {
  // "2023-11-16"
  if (!date) {
    return "";
  }
  const d = new Date(date);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${d.getFullYear()}-${
    month.toString().length === 1 ? 0 + "" + month : month
  }-${day.toString().length === 1 ? 0 + "" + day : day}`;
};

export const formatDateTime = (date: Date) => {
  // "2023-11-16"
  if (!date) {
    return "";
  }
  const d = new Date(date);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${d.getFullYear()}-${
    month.toString().length === 1 ? 0 + "" + month : month
  }-${
    day.toString().length === 1 ? 0 + "" + day : day
  } ${d.toLocaleTimeString()}`;
};

export const convertArrayToKeyObject: any = (list: any[], id: string) => ({
  ...list.reduce((prev, current, index) => {
    return { ...prev, ...{ [current[id]]: current } };
  }, {}),
});

export const sortByCreatedDate = (list: any[], dateKey = "date") =>
  list.sort(
    (a, b) => new Date(b[dateKey]).getTime() - new Date(a[dateKey]).getTime()
  );

export const convertNTCS = (no: number | string) =>
  String(no).includes("-")
    ? String(no)
        .replace("-", "")
        .split(/(?=(?:\d{3})+$)/)
        .join(",") + "-"
    : String(no)
        .split(/(?=(?:\d{3})+$)/)
        .join(",");
