import { EmptyLayout } from '@xr3ngine/client-core/components/ui/Layout/EmptyLayout';
import { doLoginAuto } from '@xr3ngine/client-core/redux/auth/service';
import { selectInstanceConnectionState } from '@xr3ngine/client-core/redux/instanceConnection/selector';
import React, {useEffect} from 'react';
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import ProfileMenu from "@xr3ngine/client-core/components/ui/UserMenu/menus/ProfileMenu";

interface Props {
    instanceConnectionState?: any;
    doLoginAuto?: any;
}

const mapStateToProps = (state: any): any => {
    return {
        instanceConnectionState: selectInstanceConnectionState(state)
    };
};

const mapDispatchToProps = (dispatch: Dispatch): any => ({
    doLoginAuto: bindActionCreators(doLoginAuto, dispatch)
});

export const IndexPage = (props: Props): any => {
  const {
    doLoginAuto
  } = props;

    useEffect(() => {
        doLoginAuto(true);
    }, []);

  // <Button className="right-bottom" variant="contained" color="secondary" aria-label="scene" onClick={(e) => { setSceneVisible(!sceneIsVisible); e.currentTarget.blur(); }}>scene</Button>

  return(
      <EmptyLayout pageTitle="Home">
          <style> {`
                [class*=menuPanel] {
                    top: 75px;
                    bottom: initial;
                }
            `}</style>
          <ProfileMenu/>
      </EmptyLayout>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(IndexPage);
