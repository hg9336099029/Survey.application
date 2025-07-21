import React, { children } from 'react'
import card1 from '../../assets/images/auth-card-3.png'
import card2 from '../../assets/images/auth-card-2.png'
import card3 from '../../assets/images/auth-card-3.png'

const Authlayout = ({children}) => {
  return (
    <div className='flex '>
      {/* left section */}

      <div className="w-full h-screen md:w-1/2 md:h-screen flex flex-col items-center justify-center">
        <h2 className=' absolute left-0 top-0 text-2xl font-bold text-black mb-8'>SURVEY SPHERE</h2>
        {children}
      </div>

      {/* right section */}
      <div className="hidden md:block md:w-1/2 md:h-[104%] absolute right-0 top-0 bottom bg-sky-100">

        <img src={card1} alt="auth" className='absolute top-[5%] right-[2%] rounded-3xl w-3/5 h-1/4 hover:scale-105 transition-all duration-300 ease-in-out' />

        <img src={card2} alt="auth" className='absolute top-[37%] left-[2%] rounded-3xl w-3/5 h-1/4 hover:scale-105 transition-all duration-300 ease-in-out' />

        <img src={card3} alt="auth" className='absolute top-[70%] right-[2%] rounded-3xl w-3/5 h-1/4 hover:scale-105 transition-all duration-300 ease-in-out'/>

      </div>
    </div>
  )
}

export default Authlayout