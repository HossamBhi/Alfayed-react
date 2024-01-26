import { formatDate } from "../../utils/helper";
import CustomInput from "./CustomInput";

const DatePickerRange = () => {
  return (
    <div className="flex gap-4">
      <CustomInput
        label="من"
        type="date"
        variant="standard"
        value={formatDate(new Date())}
      />
      <CustomInput
        label={"الي"}
        type="date"
        variant="standard"
        value={formatDate(new Date())}
      />
    </div>
  );
};

export default DatePickerRange;
