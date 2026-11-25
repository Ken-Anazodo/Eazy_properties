"use client"
import "/public/styles/css/auth.css";


export type FormImgProps = {
	bgImg: string
}

const FormImg = ({bgImg}: FormImgProps) => {
  return (
		<div className={`${bgImg} h-100 rounded-5 h-100`}></div>
  )
}

export default FormImg