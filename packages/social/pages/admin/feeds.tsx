
import React, { useEffect } from "react";

import Dashboard  from "@xr3ngine/client-core/src/common/components/Layout/SocialDashboard";
import FeedConsole  from "@xr3ngine/client-core/src/common/components/Admin/FeedConsole";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { selectFeedsState } from "@xr3ngine/client-core/reducers/feed/selector";
import { getFeeds } from "@xr3ngine/client-core/reducers/feed/service";

const mapStateToProps = (state: any): any => {
  return {
      feedsState: selectFeedsState(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  getFeeds: bindActionCreators(getFeeds, dispatch),
});
interface Props{
  feedsState?: any,
  getFeeds?: any
}

 const FeedsPage = ({feedsState, getFeeds}:Props) => {
    useEffect(()=> getFeeds('admin'), []);
    const feedsList = feedsState.get('fetching') === false && feedsState?.get('feedsAdmin') ? feedsState.get('feedsAdmin') : null;
   return (<>
    <div>
      <Dashboard>
          {feedsList && <FeedConsole list={feedsList}/>}
        </Dashboard>
    </div>
  </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedsPage);