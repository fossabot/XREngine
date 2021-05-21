import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { selectPopupsState } from "../../../reducers/popupsState/selector";
import {  updateWebXRState } from "../../../reducers/popupsState/service";
import SharedModal from "../../SharedModal";
import AppFooter from "../../Footer";

//@ts-ignore
import styles from './FeedFormPopup.module.scss';
import FeedForm from "../../FeedForm";
import WebXRPlugin from "../../WebXRPlugin";

const mapStateToProps = (state: any): any => {
    return {
      popupsState: selectPopupsState(state),
    };
  };
  
const mapDispatchToProps = (dispatch: Dispatch): any => ({
    updateWebXRState: bindActionCreators(updateWebXRState, dispatch),
});

interface Props{
    popupsState?: any;
    updateWebXRState?: typeof  updateWebXRState;
    setContentHidden?: any
}
export const WebXRStart = ({popupsState, updateWebXRState, setContentHidden}: Props) =>{
  //common for web xr

const renderWebXRModal = () =>
  popupsState?.get('webxr') === true &&  
    
        <WebXRPlugin setContentHidden={setContentHidden} />;
         
      
const webXRstate = popupsState?.get('webxr');
useEffect(()=>{renderWebXRModal();}, [webXRstate]);
    return  renderWebXRModal();         
};

export default connect(mapStateToProps, mapDispatchToProps)(WebXRStart);

