"use client"

import Layout from "@/components/layout/Layout";
import FormImg from "../component/formImg";
import SignUpForm from "./component/signupForm";

const page = () => {
  return (
	<div className="container-fluid h-100 w-100 p-0 bg-light">
		<Layout headerStyle={1} footerStyle={1}>
			<div className='main-sec row h-100 w-100 m-0'>
				<div className="col cont container mx-auto d-flex justify-content-center align-items-center p-3 p-lg-5">
					<div className='row rounded-5 p-2 p-lg-5 login-cont'>
						<div className="col-md-6">
							<SignUpForm />
						</div>

						<div className="col-md-6">
							<div className="h-100 w-100 login-img-cont">
								<FormImg bgImg="loginBgImg" />
							</div>		
						</div>
					</div>
				</div>
			</div>
		</Layout>
	</div>
  )
}

export default page