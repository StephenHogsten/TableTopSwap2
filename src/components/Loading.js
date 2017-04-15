import React from 'react';

import AutoRenewIcon from 'material-ui/svg-icons/action/autorenew';
import '../scss/Loading.scss';

const Loading = () => (
  <div className='main-body'>
    <div className='loading-body'>
      <AutoRenewIcon className='loading' />
    </div>
  </div>
);

export default Loading;