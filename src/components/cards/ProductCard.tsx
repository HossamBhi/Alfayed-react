import { Box, useTheme } from "@mui/material";
import { ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import { IconType } from "react-icons";
import { FaEdit } from "react-icons/fa";

interface ProductCardProps {
  item: any;
  containerStyle?: ComponentProps<"div">["className"];
  onClick?: (item: any) => void;
  onEdit?: (item: any) => void;
  Icon: IconType;
  showEdit?: boolean;
}

const ProductCard = ({
  item,
  containerStyle,
  onClick,
  Icon,
  showEdit = false,
  onEdit,
}: ProductCardProps) => {
  const {
    palette: { primary },
  } = useTheme();
  const { t } = useTranslation();
  return (
    <div
      className={`relative my-3 flex flex-1 cursor-pointer items-center justify-center rounded-lg bg-gray-50 p-4 hover:bg-gray-100 ${containerStyle}`}
      onClick={() => onClick && onClick(item)}
    >
      <Box
        className="relative rounded-lg p-2"
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
        {/* <Box
          onClick={() => onEdit && onEdit(item)}
          className="absolute top-[-10px] right-[-10px] rounded-full p-1 z-10 cursor-pointer"
          sx={{
            backgroundColor: primary.main,
            borderWidth: 2,
            borderColor: "#fff",
            fontSize: 12,
            color: "#fff",
          }}
        >
          {item.id}
        </Box> */}
        <Icon size="28" color={primary.main} />
      </Box>

      <div className="flex-1 px-4">
        <p className="text-sm text-gray-800">{item.name}</p>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-400">{t("common.total")}</p>
        <p className="text-lg font-bold">{item.total || 0}</p>
      </div>
    </div>
  );
};

export default ProductCard;
