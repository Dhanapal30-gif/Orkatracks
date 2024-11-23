import React from 'react';
import './Company.css'
import Imagee from '../assets/Company.png';

const Company = () => {
  return (
    <div>
    <div style={{ 
    backgroundImage: `url(${Imagee})`,
    backgroundSize: 'cover', 
    backgroundPosition: 'center', 
    width: '100%', 
    height: '297px', 
    paddingTop: '70px',
    color:'white',
    fontFamily: "neue-haas-grotesk-display"
}}>
    <h1 style={{ marginLeft: '-789px' }}>About Orka</h1>
    <h3 style={{ marginLeft: '139px' }}>EDB enables the same Postgres everywhere, from self-managed to fully managed DBaaS in the cloud.
    </h3>
</div>
<div style={{backgroundColor:'#335262',backgroundSize: 'cover', 
    backgroundPosition: 'center', 
    width: '100%', 
    height: '297px', 
    paddingTop: '70px',
    color:'white',
    fontFamily: "neue-haas-grotesk-display"}}>
<p>Nearly 1,500 customers worldwide have chosen EDB software, services, and support. <br></br>We’re proud to serve some of the world’s leading financial services,kokokoko <br></br>, media & communications, and information technology organizations. With offices worldwide, <br></br>we're able to deploy our global expertise locally and support our customers more efficiently.</p>
</div>
  </div>
  )
}

export default Company