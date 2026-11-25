"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ShortBtn from "@/components/btns/shortBtn";
import { Radio, RadioGroup } from "@uiw/react-radio";
import { showToast } from "@/utils/toastUtils";

type formInputType = {
  name: string;
  email: string;
  contactNumber: string;
  accountType: string;
};

type FormPartOneProps = {
  setFormStage: React.Dispatch<React.SetStateAction<number>>;
  formStage: number;
};

const FormPartOne = ({ setFormStage, formStage }: FormPartOneProps) => {
  const router = useRouter();

  const [formInput1, setFormInput1] = useState<formInputType>({
    name: "",
    email: "",
    contactNumber: "",
    accountType: "Agent" 
  });

  const handleOnchange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    const updated = {
      ...formInput1,
      [name]: value,
    };
    setFormInput1(updated);
    localStorage.setItem("formPart1", JSON.stringify(updated));
  };

  const handleNextStage = () => {
    if (!formInput1.name || !formInput1.email || !formInput1.contactNumber) {
      showToast.error('All Fields are required')
      return;
    }

    setFormStage(2);
    router.replace("/auth/signup?page=2"); 
  };

  return (
    <div>
      <input type="text" name="name" onChange={handleOnchange} value={formInput1.name} className="log login-input" placeholder="First name *" />
      <input type="email" name="email" onChange={handleOnchange} value={formInput1.email} className="log login-input" placeholder="Email *" />
      <input type="text" name="contactNumber" onChange={handleOnchange} value={formInput1.contactNumber} className="log login-input" placeholder="Contact Number *" />
      
      <div className="d-flex align-items-center mt-4">
        <div className="acctType me-3">
          Account Type*
        </div>
       
        <RadioGroup name="accountType" value={formInput1.accountType} onChange={handleOnchange}>
            <Radio className="me-2" value='Agent'>Agent </Radio>
            <Radio value='Agency'>Agency </Radio>
        </RadioGroup>
      </div>
      
      <div className="d-flex justify-content-end mt-3">
        <ShortBtn handleClick={handleNextStage} btnName='Next' btnStyle='btnColor1 nextBtn'/>
      </div>
    </div>
  );
};

export default FormPartOne;
