import React from "react";
import { Route, withRouter } from "react-router-dom";
import SocialMediaList from "./SocialMediaList";
import SocialMediaForm from "./SocialMediaForm";

function SocialMedia(props) {
  const prefix = props.match.path;

  return (
    <React.Fragment>
      <Route exact path={prefix} component={SocialMediaList} />
      <Route exact path={prefix + "/create"} component={SocialMediaForm} />
    </React.Fragment>
  );
}

export default withRouter(SocialMedia);
