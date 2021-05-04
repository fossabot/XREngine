import React, { useEffect } from 'react';
import { bindActionCreators, Dispatch } from "redux";
import UserConsole from "@xr3ngine/client-core/src/admin/components/Users";
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

function users(props: Props) {
    const { doLoginAuto } = props;
    useEffect(() => {
        doLoginAuto(true);
    }, []);
    return (
        <UserConsole />
    );
}


export default connect(mapStateToProps, mapDispatchToProps)(users);