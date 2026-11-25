"use client"

import React, { useEffect, useState } from 'react';
import EnterEmail from './password-reset-stage/enterEmail';
import PasswordChange from './password-reset-stage/passwordChange';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import "/public/styles/css/auth.css";


type formInputType = {
	image: string,
	state: string,
	country: string,
	password: string,
	confirmPassword: string
}


const ResetPassword = () => {

	const searchParams = useSearchParams()
	const [formStage, setFormStage] = useState<number>(1)


	useEffect(() => {
		const page = searchParams.get("page");
		if (page === "2") {
			setFormStage(2);
		} else {
			setFormStage(1);
		}
	}, [searchParams]);
	


	

  return (
	<div className="loginForm-cont sign-cont container-fluid w-100 rounded-5 px-3 py-4 px-md-3 py-md-5">
		<div className='formTitle text-capitalize'>
			<p className='fs-1'>Reset Password</p>
		</div>

		<form method='POST' className='mt-3'>
		{formStage === 2 ? (
					<PasswordChange />
				) : (
					<EnterEmail />
				)}
		
		</form>

		<div className='form-txt w-100 mt-5 cursor-pointer'>
			<p className='mb-1'>You do not have an account?</p>
			<Link href="/auth/signup/">
				<p className='signup cursor-pointer text-decoration-underline pt-0 mt-0'>SIGN UP</p>
			</Link>
		</div>
	</div>
  )
}

export default ResetPassword