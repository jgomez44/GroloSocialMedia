import React from "react";
import "./SocialMedia.scss";
import axios from "axios";
import { getAllSocialMedias } from "../../services/socialMedia.service";
import { Button, Card } from "reactstrap";

class SocialMediaForm extends React.Component {
  state = {
    name: "",
    code: "",
    codeUpper: "",
    pascalCaseName: "",
    success: false,
    error: false,

    name_isValid: false,
    code_isValid: false
  };

  componentDidMount = () => {};

  handleClearForm = () => {
    this.setState({ name: "", code: "" });
  };

  handleSocialMediaList = () => {
    this.props.history.push("/admin/socialmedia");
  };

  handleCodeOnChange = e => {
    const code = e.target.value;
    let code_isValid = false;
    if (code.length > 0 && code.length < 26) {
      code_isValid = true;
    }
    this.setState({ code, code_isValid });
  };

  handleNameOnChange = e => {
    let name_isValid = false;
    const name = e.target.value;
    if (name.length > 0 && name.length < 51) {
      name_isValid = true;
    }
    this.setState({ name, name_isValid });
  };

  handleUpper = code => {
    let codeUpper = code.toUpperCase();
    this.setState({ codeUpper });
    return codeUpper;
  };

  handleAddNewSocialMedia = () => {
    let codeUpper = this.handleUpper(this.state.code);
    let pascalCaseName = this.handlePascalCase(this.state.name);
    axios.post("/api/socialmedia", {
      name: pascalCaseName,
      code: codeUpper
    });
    getAllSocialMedias()
      .then(response => {
        this.setState({ success: true, error: false, id: null });
        this.props.history.push("/admin/socialmedia");
      })
      .catch(response => this.setState({ success: false, error: true }));
  };

  handlePascalCase = name => {
    let pascalCaseName = name
      .toLowerCase()
      .split(" ")
      .map(function(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
    this.setState({ pascalCaseName });
    return pascalCaseName;
  };

  render() {
    return (
      <Card>
        <br />
        <h3 className="text-center content-header">Add New Social Media</h3>
        <form className="novalidate card cardPadding">
          <div className="form-group">
            <h6>
              Social Media: <span className="required">*</span>
            </h6>
            <div className="controls">
              <input
                value={this.state.name}
                style={{ textTransform: "capitalize" }}
                onChange={this.handleNameOnChange}
                type="text"
                name="text"
                className="form-control"
                required
                data-validation-required-message="This field is required"
                maxLength="50"
              />
              <p>Must be less than 50 characters</p>
            </div>
          </div>
          <div className="form-group">
            <h6>
              Social Media Code: <span className="required">*</span>
            </h6>
            <div className="controls">
              <input
                type="text"
                style={{ textTransform: "uppercase" }}
                value={this.state.code}
                onChange={this.handleCodeOnChange}
                name="text"
                className="form-control"
                required
                data-validation-required-message="This field is required"
                maxLength="50"
              />
              <p>Must be less than 25 characters</p>
            </div>
          </div>
          <div>
            <Button
              type="button"
              className="btn btn-success smfSubmitBtn"
              disabled={!this.state.name_isValid || !this.state.code_isValid}
              onClick={this.handleAddNewSocialMedia}
            >
              <i className="fa fa-thumbs-o-up" aria-hidden="true" /> &nbsp; Submit
            </Button>
            <Button
              type="button"
              onClick={this.handleSocialMediaList}
              className="btn btn-primary smfCancelBtn"
            >
              <i className="fa fa-times-circle" aria-hidden="true" /> &nbsp; Cancel
            </Button>
          </div>
        </form>
        <br />
      </Card>
    );
  }
}

export default SocialMediaForm;
