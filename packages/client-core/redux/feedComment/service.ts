import { random } from 'lodash';
import { Dispatch } from 'redux';
import { dispatchAlertError } from "../alert/service";
import { client } from '../feathers';
import {
  fetchingFeedComments, 
  feedsRetrieved,
  addFeedCommentFire,
  removeFeedCommentFire ,
  addFeedComment
} from './actions';
import { CommentInterface } from '@xr3ngine/common/interfaces/Comment';

export function getFeedComments(feedId : string, limit?: number) {
  return async (dispatch: Dispatch, getState: any): Promise<any> => {
    try {
      dispatch(fetchingFeedComments());
      const data = [] as CommentInterface[];
      for(let i=0; i<2; i++){
          data.push({ 
              id: i.toString(),
              feedId,
              creator:{
                  id:'185',
                  userId:'458',
                  avatar :'https://picsum.photos/40/40',
                  name: 'User username',
                  username: 'username',
                  verified : i%6 ? true : false,
              },
              fires: random(593),
              isFired: i%5 ? true : false,
              text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris ni '
          })
      }
      dispatch(feedsRetrieved(data));
    } catch(err) {
      console.log(err);
      dispatchAlertError(dispatch, err.message);
    }
  };
}

export function addFireToFeedComment(commentId: string, creatorId: string) {
  return async (dispatch: Dispatch): Promise<any> => {
    try {
      // await client.service('feedFires').create({feedId, creatorId});
      dispatch(addFeedCommentFire(commentId));
    } catch(err) {
      console.log(err);
      dispatchAlertError(dispatch, err.message);
    }
  };
}

export function removeFireToFeedComment(commentId: string, creatorId: string) {
  return async (dispatch: Dispatch): Promise<any> => {
    try {
      // await client.service('feedFires').create({feedId, creatorId});
      dispatch(removeFeedCommentFire(commentId));
    } catch(err) {
      console.log(err);
      dispatchAlertError(dispatch, err.message);
    }
  };
}

export function addCommentToFeed(feedId: string, creatorId: string, text: string) {
  return async (dispatch: Dispatch): Promise<any> => {
    try {
      // await client.service('feddComment').create({feedId, creatorId, text});
      const toRedux = {
        feedId, 
        id: '4864', 
        creator:{
          id:creatorId,
          userId:'458',
          avatar :'https://picsum.photos/40/40',
          name: 'User username',
          username: 'username',
          verified : true,
      },
      fires: 0,
      isFired: false,
      text
      }
      dispatch(addFeedComment(toRedux));
    } catch(err) {
      console.log(err);
      dispatchAlertError(dispatch, err.message);
    }
  };
}