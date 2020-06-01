import * as React from 'react';
import {store} from '../store';
import {runNavigate} from '../store/actions/queueNavigate';
export const navigationRef = React.createRef();
export const isMountedRef = React.createRef();

export function navigate(name, params) {
  if (isMountedRef.current && navigationRef.current) {
    navigationRef.current.navigate(name, params);
    store.dispatch(runNavigate());
  }
}
