"use client"
import { useUserSignUpMutation } from '@/services/userAuthApi';

type shortBtnProps = {
	btnName: string,
	btnStyle: string
	handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void; 
}

const ShortBtn = ({btnName, btnStyle, handleClick}: shortBtnProps) => {
	const [userSignUp, {isLoading}] = useUserSignUpMutation();
  return (
	<div>
		<button onClick={handleClick} className={`${btnStyle} shortBtn btn mt-4 px-5 py-2 text-center rounded-5 text-uppercase cursor-pointer`} disabled={isLoading} type="submit">{btnName}</button>
	</div>
  )
}

export default ShortBtn