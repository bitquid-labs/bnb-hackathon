import React from 'react';

import Discord from 'assets/images/discord.svg';
import Telegram from 'assets/images/telegram.svg';
import Linkedin from 'assets/images/linkedin.svg';
import Twitter from 'assets/images/x.svg';
import Medium from 'assets/images/medium.svg';

const Socials: React.FC = () => {
  return (
    <div className='flex gap-6'>
      <a href='https://www.linkedin.com/company/bq-labs' target='blank'>
        <img src={Linkedin} alt="linkedin" />
      </a>
      <a href='https://discord.gg/QU4YUgJMJJ' target='blank'>
      <img src={Discord} alt="linkedin" />
      </a>
      <a href='https://t.me/+xj1JDLHhA8VhZjJl'>
        <img src={Telegram} alt="linkedin" />
      </a>
      <a href='https://medium.com/@bqlabssocials' target='blank'>
        <img src={Medium} alt="linkedin" />
      </a>
      <a href='https://x.com/BQ_Labs' target='blank'>
        <img src={Twitter} alt="linkedin" />
      </a>
    </div>
  );
};

export default Socials;