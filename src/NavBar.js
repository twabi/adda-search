import React from 'react'
import { Layout } from 'antd';

const { Header } = Layout;


const NavBar = () => {


     return(

         <div>
             <Header className="header text-start">
                 <div className="logo text-white text-start font-weight-bold ">
                     <b className="h5 text-start">Wakanda Search App</b>
                 </div>
             </Header>

         </div>
     );
}
export default NavBar;
