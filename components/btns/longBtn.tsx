"use client"

type LongBtnProps = {
	btnName: string,
	btnStyle: string
}

const LongBtn = ({btnName, btnStyle}: LongBtnProps) => {
  return (
	<div>
		<button className={`submit ${btnStyle} btn mt-4 text-center rounded-5 text-uppercase cursor-pointer`} type="submit">{btnName}</button>
	</div>
  )
}

export default LongBtn