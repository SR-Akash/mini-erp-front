import React from 'react';
import { Divider } from 'antd';
import iBosLog from '../../assets/images/ibosPngLogo.png';

const HPoweredBy = () => {
  return (
    <div style={{ margin: '50px 0px', width: '100%' }}>
      <Divider>
        <small className="text-secondary">Powered by</small>
      </Divider>
      <div style={{ textAlign: 'center' }}>
        <img src={iBosLog} alt="hire-desk-logo" width="200px" />
      </div>
    </div>
  );
};

export default HPoweredBy;
