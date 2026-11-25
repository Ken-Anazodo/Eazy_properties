import ShortBtn from '@/components/btns/shortBtn'
import { useUserRequestPasswordResetMutation } from '@/services/userAuthApi'
import React, { useEffect, useState } from 'react'
import { showToast } from '@/utils/toastUtils'
import { useRouter } from 'next/navigation'

const EnterEmail = () => {

	const navigate = useRouter();
	const [userRequestPasswordReset, {isLoading, isSuccess, data}] = useUserRequestPasswordResetMutation();

	const [emailData, setEmailData] = useState({
		email: ""
	})

	const getEmail = (event:any) => {
		const {name, value} = event.currentTarget

		setEmailData((prev)=>({
			...prev,
			[name]:value
		}))

	}

	const submitEmail = async(event: any) => {
		event.preventDefault();

		if (!emailData.email){
			showToast.error("Please enter your Email Address")
			console.log("Please Enter Your Email Address");
		} 

		try{
			await userRequestPasswordReset(emailData).unwrap();
		}catch(error:any){
			showToast.error(error?.data.message)
			console.log(error?.data.message)
		}
		
	}

	useEffect(() => {
		if (isSuccess){
			showToast.success(data.message);
			navigate.push(`/auth/reset-password/email-notification?email=${emailData.email}`);

			setEmailData({
			email: ""
		})
		}
	}, [isSuccess, data])
	


  return (
	<div>	
		<div className='d-md-flex align-items-center'>
			<input onChange={getEmail} type="email" name="email" id="email" autoComplete="email" className="log login-input" placeholder="Enter Your Email *" value={emailData.email}/>
			<ShortBtn handleClick={submitEmail} btnName={isLoading? "Please wait..." : "Submit"} btnStyle='btnColor1'/>
		</div>
	</div>
  )
}

export default EnterEmail