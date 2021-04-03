
import React, { useEffect } from 'react';
import Dashboard from "@xr3ngine/client-core/src/common/components/Layout/Dashboard";
import { bindActionCreators, Dispatch } from "redux";
import GroupsConsole from "@xr3ngine/client-core/src/common/components/Admin/CroupsConsole";
import { doLoginAuto } from '@xr3ngine/client-core/src/user/reducers/auth/service';
import { connect } from 'react-redux';

interface Props {
    doLoginAuto?: any;
}

const mapStateToProps = (state: any): any => {
    return {
    };
};

const mapDispatchToProps = (dispatch: Dispatch): any => ({
    doLoginAuto: bindActionCreators(doLoginAuto, dispatch)
});

 function Groups( props: Props) {
    const { doLoginAuto } = props;     
    useEffect(() => {
       doLoginAuto(true);
    }, []); 
    return (
        <Dashboard>
           <GroupsConsole/>
        </Dashboard>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Groups);