import { Box, useTheme } from "@mui/material";
import { FaUserTie } from "react-icons/fa6";
import { convertNTCS } from "../../utils/helper";

const ClientCard = ({ item }: any) => {
  const {
    palette: { primary },
  } = useTheme();
  return (
    <div className="my-3 flex flex-1 cursor-pointer items-center justify-center rounded-lg bg-gray-50 p-4 hover:bg-gray-100">
      <Box
        className="rounded-lg p-2"
        sx={{ backgroundColor: primary.main + "50" }}
      >
        <FaUserTie size="28" color={primary.main} />
      </Box>

      <div className="flex-1 px-4">
        <p className="text-sm text-gray-800">{item.name}</p>
      </div>

      <div className="">
        <p className="text-lg font-bold">{convertNTCS(item.total || 0)}</p>

        {/* <p>{item.date}</p> */}
      </div>
    </div>
  );
};

export default ClientCard;
