import React, {PropsWithChildren} from 'react';

import Header from './Header';
import Footer from './Footer';
import Providers from './Providers';

const MainLayout = ({children}: PropsWithChildren) => {
  return (
    <Providers>
      <Header />
      <main>{children}</main>
      <Footer />
    </Providers>
  );
};
export default MainLayout;
