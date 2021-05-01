import { Box, CardActionArea, CardActions, CardContent, CardMedia, makeStyles, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { updateShareFormState } from '../../reducers/popupsState/service';
// @ts-ignore
import styles from './ShareForm.module.scss';
import { Plugins } from '@capacitor/core';
const { Share } = Plugins;

const mapDispatchToProps = (dispatch: Dispatch): any => ({
   updateShareFormState: bindActionCreators(updateShareFormState, dispatch)
});

interface Props{
   updateShareFormState?: typeof updateShareFormState;
}

const useStyles = makeStyles({
  root: {
    maxWidth: '375pt',
  },
  media: {
    height: '340pt',
    width : '375pt',
  },
  btn_share: {
   backgroundColor: 'black',
   color: 'white',
   bottom: '0',
   width: '100%',
   borderRadius: '12px',
   '&:hover': {
     backgroundColor: 'black',
     color: 'white',
 },
  },
});

const ShareForm = ({updateShareFormState}:Props) => {

   const classes = useStyles();


   const shareVia = () => {
    Share.share({
        title: 'See cool stuff',
        text: 'I Created This Video',
        url: 'http://arcmedia.us/',
        dialogTitle: 'Share with buddies'
      });
   };

   return  (
    <div>
    <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
   minHeight="50vh"
   >
 <CardMedia
   className={classes.media}
   image='https://cdn.zeplin.io/601d63dc422d9dad3473e3ab/assets/14A023CD-2A56-4EDF-9D40-7B86746BF447.png'
   title="Arc"
 />
 </Box>
 <Button size="large" color="primary" onClick={shareVia} className={classes.btn_share}>
   Share Video
 </Button>
 <Button size="large" color="primary" style={{width: '100%'}} onClick={() => {updateShareFormState(false);}} >
   Save To Camera Roll
 </Button>
 <Button size="large" color="primary" style={{width: '100%'}} onClick={() => {updateShareFormState(false);}} >
   Cancel
 </Button>
 </div>


   );
};

export default connect(null, mapDispatchToProps) (ShareForm);