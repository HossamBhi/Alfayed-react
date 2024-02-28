import { Box, useTheme } from "@mui/material";
import { t } from "i18next";
import { ComponentProps } from "react";
import { FaEdit } from "react-icons/fa";
import { GiPayMoney } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { convertNTCS } from "../../utils/helper";

interface ExpensesCardProps {
  item: any;
  containerStyle: ComponentProps<"div">["className"];
  onEdit?: (item: any) => void;
  showEdit?: boolean;
}

const ExpensesCard = ({
  item,
  containerStyle,
  showEdit = false,
  onEdit,
}: ExpensesCardProps) => {
  const navigate = useNavigate();
  const {
    palette: { primary },
  } = useTheme();

  return (
    <div
      className={`relative my-3 flex flex-1 cursor-pointer items-center justify-center rounded-lg bg-gray-50 p-4 hover:bg-gray-100 ${containerStyle}`}
      onClick={() => {
        if (showEdit) {
          onEdit && onEdit(item);
        } else navigate("expenses-details?id=" + item.id);
      }}
    >
      <Box
        className="rounded-lg p-2"
        sx={{ backgroundColor: primary.main + "50" }}
      >
        {showEdit && (
          <Box
            onClick={() => onEdit && onEdit(item)}
            className="absolute right-[-10px] top-[-10px] z-10 cursor-pointer rounded-full p-1"
            sx={{
              backgroundColor: primary.main,
              borderWidth: 2,
              borderColor: "#fff",
            }}
          >
            <FaEdit color="#fff" size="12" />
          </Box>
        )}
        <GiPayMoney size="28" color={primary.main} />
      </Box>

      <div className="flex-1 px-4">
        <p className="text-sm text-black">{item.name}</p>
        <p className="text-xs text-gray-500">{item.expenseTypeName}</p>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-400">{t("common.total")}</p>
        <p className="text-lg font-bold">{convertNTCS(item.totalRemaining || 0)}</p>
      </div>
    </div>
  );
};

export default ExpensesCard;
