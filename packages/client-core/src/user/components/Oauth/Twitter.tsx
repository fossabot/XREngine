import { useLocation, withRouter } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { loginUserByJwt, refreshConnections } from '../../reducers/auth/service';
import Container from '@material-ui/core/Container';
import { selectAuthState } from '../../reducers/auth/selector';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

const mapStateToProps = (state: any): any => {
  return {
    auth: selectAuthState(state)
  };
};

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  loginUserByJwt: bindActionCreators(loginUserByJwt, dispatch),
  refreshConnections: bindActionCreators(refreshConnections, dispatch)
});


const TwitterCallbackComponent = (props): any => {
  const { auth, loginUserByJwt, refreshConnections } = props;

  const initialState = { error: '', token: '' };
  const [state, setState] = useState(initialState);
  const search = new URLSearchParams(useLocation().search);

  useEffect(() => {
    const error = search.get('error') as string;
    const token = search.get('token') as string;
    const type = search.get('type') as string;
    const path = search.get('path') as string;
    const instanceId = search.get('instanceId') as string;

    if (!error) {
      if (type === 'connection') {
        const user = auth.get('user');
        refreshConnections(user.id);
      } else {
        let redirectSuccess = `${path}`;
        if (instanceId != null) redirectSuccess += `?instanceId=${instanceId}`;
        loginUserByJwt(token, redirectSuccess || '/', '/');
      }
    }

    setState({ ...state, error, token });
  }, []);

  return state.error && state.error !== '' ? (
    <Container>
      Twitter authentication failed.
      <br />
      {state.error}
    </Container>
  ) : (
    <Container>Authenticating...</Container>
  );
};

export const TwitterCallback = withRouter(connect(mapStateToProps, mapDispatchToProps)(TwitterCallbackComponent));
