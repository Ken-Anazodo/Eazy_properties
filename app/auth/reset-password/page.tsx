"use client"

import Layout from "@/components/layout/Layout";
import FormImg from "../component/formImg";
import ResetPassword from "./components/resetPassword";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";



const page = () => {
	const router = useRouter()
	const getMessage = useSearchParams()

	useEffect(() => {

		const message = getMessage?.get('message')
			if(message){
				alert(message)
			}
	
	  
	}, [router]) 
	
  return (
	<div className="container-fluid h-100 w-100 p-0 bg-light">
		<Layout headerStyle={1} footerStyle={1}>
			<div className='main-sec container mx-auto row h-100 w-100 m-0'>
				<div className="col cont d-flex justify-content-center align-items-center p-3 p-lg-5">
					<div className='row rounded-5 p-2 p-lg-5 login-cont'>
						<div className="col-md-6">
							<div className="login-img-cont w-100 h-100">
								<FormImg bgImg="loginBgImg" />
							</div>		
						</div>
						
						<div className="col-md-6">
							<ResetPassword />
						</div>
					</div>
				</div>
			</div>
		</Layout>
	</div>
  )
}

export default page