"use client"

import React, { useEffect, useState } from 'react';
import FormPartOne from './form-parts/formPartOne';
import FormPartTwo from './form-parts/formPartTwo';
import { useUserSignUpMutation } from '@/services/userAuthApi';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { showToast } from '@/utils/toastUtils';
import "/public/styles/css/auth.css"
import Loading from '@/app/loading';


type formInputType = {
	image: string,
	state: string,
	country: string,
	password: string,
	confirmPassword: string
}


const SignUpForm = () => {

	const router = useRouter()
	const searchParams = useSearchParams()
	const [userSignUp, {error, isSuccess, isLoading}]:any = useUserSignUpMutation();
	const [uploading, setUploading] = useState(false);
	const [imageName, setImageName] = useState("");
	const [formStage, setFormStage] = useState<number>(1)
	const [formInput2, setFormInput2] = useState<formInputType>({
		image: "",
		state: "",
		country: "",
		password: "",
		confirmPassword: ""
	})

	useEffect(() => {
		const page = searchParams.get("page");
		if (page === "2") {
			setFormStage(2);
		} else {
			setFormStage(1);
		}
	}, [searchParams]);

	


	const handleSubmit = async(event:any) => {
		event.preventDefault();

		if(error){
			// showToast.error(error?.data.message)
			console.log(error.data.message)
		}

		if (!formInput2.state || !formInput2.country || !formInput2.password || !formInput2.confirmPassword) {
			showToast.error("All input field are required")
			console.log(formInput2.state, formInput2.country, formInput2.confirmPassword, formInput2.password)
			return;
		}

		if (formInput2.password !== formInput2.confirmPassword){
			showToast.error("Password and Confirm Password must be a match!")
			return;
		}
		
		if (uploading) {
			showToast.warning("Please wait for the image to finish uploading.")
			return;
		  }
		  

		if (!formInput2.image) {
			showToast.error("No Profile Image Uploaded")
			console.error("No Profile Image Uploaded")
			return;
		}
	
		try{
			const formDetails = JSON.parse(localStorage.getItem("allData") || "")
			await userSignUp(formDetails).unwrap();

			setFormInput2({
				image: "",
				state: "",
				country: "",
				password: "",
				confirmPassword: ""
			})

			setImageName("");

			localStorage.removeItem("allData")
			localStorage.removeItem("updated")

		} catch (err:any){
			showToast.error(err.error || "An error occurred during signup.")
			console.error("Error in Sign Up:", err)
		}
	}

	useEffect(() => {
		if (isSuccess){
			router.replace("../../../dashboard/page.tsx")
		}
	}, [isSuccess, router])
	


	

  return (
	<div className="loginForm-cont sign-cont container-fluid w-100 rounded-5 px-3 py-4 p-md-5">
		<div className='formTitle text-capitalize'>
			<p className='fs-1'>Sign Up</p>
		</div>

		{isLoading && <Loading />}

		<form onSubmit={handleSubmit} method='POST' className='mt-6'>
		{formStage === 1 ? (
					<FormPartOne
						setFormStage={setFormStage}
						formStage={formStage}
						/>
				) : (
					<FormPartTwo 
						formInput2={formInput2} 
						setFormInput2={setFormInput2} 
						setImageName={setImageName} 
						imageName={imageName}
						setUploading={setUploading}
						uploading={uploading}
					/>
				)}
		
		</form>

		<div className='form-txt w-100 mt-3 cursor-pointer'>
			<p className='mb-1'>You do not have an account?</p>
			<Link href="/auth/login/">
				<p className='signup cursor-pointer text-decoration-underline pt-0 mt-0'>LOG IN</p>
			</Link>
		</div>
		

	</div>
  )
}

export default SignUpForm