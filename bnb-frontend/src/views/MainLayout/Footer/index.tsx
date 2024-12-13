import React from 'react';

import Copy from 'assets/images/copyright.svg'
import Socials from './Socials';


const Footer: React.FC = () => {
  return (
    <footer className='w-full z-[99] max-w-1220 mx-auto mt-40'>
      <div className='layout border-border-100 flex w-[1250px] items-center justify-between border-t-[0.5px] h-[100px]'>
        <div className='flex items-center gap-2'>
          <img src={Copy} alt="copy" />
          <div className='text-[#FFF]'>2024 BitQuid Labs. all Right Reserved</div>
        </div>
        {/* <div className='flex items-center gap-7'>
          <div>Contact Us</div>
          <div>Terms of Use</div>
          <div>Help Center</div>
        </div> */}
        <Socials />
      </div>
    </footer>
  );
};

export default Footer;
