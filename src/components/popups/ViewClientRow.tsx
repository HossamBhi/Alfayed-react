import { DialogContent } from "@mui/material";
import { formatDate } from "../../utils/helper";
import { clientRowProps, productListProps } from "../../utils/types";
import { CustomDialog } from "../common";

type ViewClientRowProps = {
  onClose?: () => void;
  show: boolean;
  data?: clientRowProps;
};

const ViewClientRow = ({ onClose, show, data }: ViewClientRowProps) => {
  const handleOnCloseAddProduct = onClose;

  return (
    <div>
      <CustomDialog open={show} onClose={handleOnCloseAddProduct}>
        <DialogContent className="w-full grid grid-cols-5 !p-0">
          <span className="col-span-5 bg-green-900 py-4 rounded-t text-center font-bold text-white text-lg">
            السائق: {data?.driverName} / التاريخ {formatDate(data?.date as any)}
          </span>
          <div className="w-full grid col-span-5 grid-cols-5">
            <span className="col-span-1 bg-green-50 p-2 py-4 border font-bold text-lg">
              الصنف
            </span>
            <span className="col-span-1 bg-green-50 p-2 py-4 border font-bold text-lg">
              الوزن
            </span>
            <span className="col-span-1 bg-green-50 p-2 py-4 border font-bold text-lg">
              السعر
            </span>
            <span className="col-span-1 bg-green-50 p-2 py-4 border font-bold text-lg">
              المبلغ
            </span>
            <span className="col-span-1 bg-green-50 p-2 py-4 border font-bold text-lg">
              العدد
            </span>
          </div>
          {data?.productList?.map((item: productListProps) => (
            <div className="w-full grid col-span-5 grid-cols-5" key={item.id}>
              <span className="col-span-1 p-2 border">{item.productName}</span>
              <span className="col-span-1 p-2 border">{item.quantity}</span>
              <span className="col-span-1 p-2 border">{item.price}</span>
              <span className="col-span-1 p-2 border">{item.total}</span>
              <span className="col-span-1 p-2 border">{item.number}</span>
            </div>
          ))}
          <span className="col-span-2 p-2 py-4 border font-bold">
            واصل الســـــــــــــــــــــــــــــــــــــائق
          </span>
          <span className="col-span-1 p-2 py-4 border"></span>
          <span className="col-span-2 p-2 py-4 border">
            {data?.deliveredToDriver}
          </span>

          <span className="col-span-1 bg-green-50 p-2 py-4 border rounded-br font-bold">
            الاجمالي
          </span>
          <span className="col-span-1 bg-green-50 p-2 py-4 border">
            {data?.carCapacity}
          </span>
          <span className="col-span-1 bg-green-50 p-2 py-4 border"></span>
          <span className="col-span-2 bg-green-50 p-2 py-4 border rounded-bl">
            {data?.total}
          </span>
        </DialogContent>
      </CustomDialog>
    </div>
  );
};

export default ViewClientRow;
