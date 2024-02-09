import { Dispatch, SetStateAction } from "react";
import { formatDate } from "../../utils/helper";
import CustomInput from "./CustomInput";

type DatePickerRangeProps = {
  startDate: Date;
  setStartDate: Dispatch<SetStateAction<Date>>;
  endDate: Date;
  setEndDate: Dispatch<SetStateAction<Date>>;
};

const DatePickerRange = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: DatePickerRangeProps) => {
  return (
    <div className="flex gap-4">
      <CustomInput
        label="من"
        type="date"
        variant="standard"
        value={formatDate(startDate)}
        onChange={(e) => {
          const { value } = e.target;
          setStartDate(new Date(value));
        }}
      />
      <CustomInput
        label={"الي"}
        type="date"
        variant="standard"
        value={formatDate(endDate)}
        onChange={(e) => {
          const { value } = e.target;
          setEndDate(new Date(value));
        }}
      />
    </div>
  );
};

export default DatePickerRange;
