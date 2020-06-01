import React, {useEffect} from 'react';
import {StartService} from '../helpers/ServiceNotification';

const BackgroundTasks = (props) => {
  useEffect(() => {
    StartService();
  }, []);
  return <>{props.children}</>;
};

export default BackgroundTasks;
