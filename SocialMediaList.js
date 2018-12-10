import React from "react";
import "./SocialMedia.scss";
import {
  getAllSocialMedias,
  deleteSocialMedia,
  getSocialMediaById,
  updateSocialMedia,
  addNewSocialMedia
} from "../../services/socialMedia.service";
import SocialMediaModal from "./SocialMediaModal";
import { Button, Card, CardHeader } from "reactstrap";

class SocialMediaList extends React.Component {
  state = {
    name: "",
    code: "",
    pageIndex: 0,
    socialMediaList: [],
    socialMediaPlatformInfo: [],
    modalName: "",
    modalCode: "",
    codeUpper: "",
    pascalCaseName: "",
    success: false,
    error: false,

    name_isValid: false,
    code_isValid: false,
    modalName_isValid: false,
    modalCode_isValid: false,

    linkedSocialMediaPlatform: false,

    modalShow: false
  };

  componentDidMount = () => {
    this.handleDisplayAllSocialMedias();
  };

  showModal = () => {
    this.setState({ showModal: true });
  };

  hideModal = () => {
    this.setState({ showModal: false, linkedSocialMediaPlatform: false });
  };

  handleClearForm = () => {
    this.setState({ name: "", code: "" });
  };

  handleUpper = code => {
    let codeUpper = code.toUpperCase();
    this.setState({ codeUpper });
    return codeUpper;
  };

  handleAddNewSocialMedia = () => {
    let codeUpper = this.handleUpper(this.state.code);
    let pascalCaseName = this.handlePascalCase(this.state.name);
    const newSocialMediaInfo = {
      name: pascalCaseName,
      code: codeUpper
    };
    addNewSocialMedia(newSocialMediaInfo)
      .then(response => {
        this.setState({ success: true, error: false, id: null });
        this.handleDisplayAllSocialMedias();
        this.handleClearForm();
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

  handleEditSocialMedia = id => {
    getSocialMediaById(id)
      .then(response => {
        this.setState({
          socialMediaPlatformInfo: response.data.item,
          id: id,
          code: response.data.item.code,
          name: response.data.item.name,
          success: true,
          error: false,
          modalName_isValid: true,
          modalCode_isValid: true
        });
        this.modalToggle();
        this.populateModal(response.data.item);
      })
      .catch(response => this.setState({ error: true, success: false }));
  };

  populateModal = socialMediaPlatformInfo => {
    this.setState({
      modalName: socialMediaPlatformInfo.name,
      modalCode: socialMediaPlatformInfo.code
    });
  };

  handleUpdateSocialMedia = id => {
    let codeUpper = this.handleUpper(this.state.modalCode);
    let pascalCaseName = this.handlePascalCase(this.state.modalName);

    const socialMediaInfo = {
      name: pascalCaseName,
      code: codeUpper,
      id: id
    };

    updateSocialMedia(id, socialMediaInfo)
      .then(response => {
        this.setState({
          success: true,
          error: false,
          isEditing: false,
          name_isValid: false,
          code_isValid: false,
          modalName_isValid: false,
          code: "",
          name: "",
          modalName: "",
          modalCode: "",
          id: null,
          linkedSocialMediaPlatform: false
        });
        this.handleDisplayAllSocialMedias();
        this.handleClearForm();
        this.modalToggle();
      })
      .catch(response => this.setState({ success: false, error: true }));
  };

  handleDisplayAllSocialMedias = () => {
    getAllSocialMedias()
      .then(response => {
        this.setState({
          socialMediaList: response.data.item.pagedItems,
          success: true,
          error: false
        });
      })
      .catch(response => this.setState({ error: true, success: false }));
  };

  handleNameOnChange = e => {
    let name_isValid = false;
    const name = e.target.value;
    if (name.length > 0 && name.length < 51) {
      name_isValid = true;
    }
    this.setState({ name, name_isValid });
  };

  handleModalNameOnChange = e => {
    let modalName_isValid = false;
    const modalName = e.target.value;
    if (modalName.length > 0 && modalName.length < 51) {
      modalName_isValid = true;
    }
    this.setState({ modalName, modalName_isValid });
  };

  handleCodeOnChange = e => {
    const code = e.target.value;
    let code_isValid = false;
    if (code.length > 0 && code.length < 26) {
      code_isValid = true;
    }
    this.setState({ code, code_isValid });
  };

  handleModalCodeOnChange = e => {
    const modalCode = e.target.value;
    let modalCode_isValid = false;
    if (modalCode.length > 0 && modalCode.length < 26) {
      modalCode_isValid = true;
    }
    this.setState({ modalCode, modalCode_isValid });
  };

  handleDeleteSocialMedia = id => {
    deleteSocialMedia(id)
      .then(response => {
        this.setState({
          success: true,
          error: false,
          modalName_isValid: false,
          modalName: "",
          modalCode: "",
          id: null
        });
        this.handleDisplayAllSocialMedias();
        this.modalToggle();
      })
      .catch(response => {
        this.setState({ success: false, error: true, linkedSocialMediaPlatform: true });
      });
  };

  modalToggle = () => {
    this.setState({
      modalShow: !this.state.modalShow
    });
    if (this.state.linkedSocialMediaPlatform === true) {
      this.setState({ linkedSocialMediaPlatform: false });
    }
  };

  handleCreateClicked = () => {
    const prefix = this.props.match.path;
    this.props.history.push(prefix + "/create");
  };

  render() {
    let socialMediaPlatforms = this.state.socialMediaList.map(socialMedia => {
      return (
        <tr key={socialMedia.id}>
          <td>{socialMedia.name}</td>
          <td>{socialMedia.code}</td>
          <td>
            <a
              className="success p-0"
              data-original-title=""
              title=""
              onClick={() => {
                this.handleEditSocialMedia(socialMedia.id);
              }}
            >
              <i className="fa fa-pencil-square-o warning" aria-hidden="true" />
            </a>
          </td>
        </tr>
      );
    });
    return (
      <Card>
        <CardHeader>
          <Button className="btn btn-info right" onClick={this.handleCreateClicked}>
            Add New Platform
          </Button>
        </CardHeader>
        <h1 className="text-center content-header">Social Media Platforms</h1>
        <br />
        <table
          className="table table-striped table-hover text-center fixed"
          border="2"
          style={{ width: "100%" }}
        >
          <thead>
            <tr>
              <th>Name:</th>
              <th>Code:</th>
              <th>Edit:</th>
            </tr>
          </thead>
          <tbody>{socialMediaPlatforms}</tbody>
        </table>
        <br />
        <SocialMediaModal modalShow={this.state.modalShow} socialMediaName={this.state.name}>
          <h4 className="text-center">Edit Social Media</h4>
          <form className="novalidate card cardPadding">
            <div className="form-group">
              <h6>
                Social Media: <span className="required">*</span>
              </h6>
              <div className="controls">
                <input
                  value={this.state.modalName}
                  style={{ textTransform: "capitalize" }}
                  onChange={this.handleModalNameOnChange}
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
                  value={this.state.modalCode}
                  onChange={this.handleModalCodeOnChange}
                  name="text"
                  className="form-control"
                  required
                  data-validation-required-message="This field is required"
                  maxLength="50"
                />
                <p>Must be less than 25 characters</p>
              </div>
            </div>
            {this.state.linkedSocialMediaPlatform ? (
              <p style={{ textTransform: "none", color: "red" }}>
                This social media platform is in use and cannot be deleted.
              </p>
            ) : null}
            <div style={{ display: "flex" }}>
              <Button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  this.handleDeleteSocialMedia(this.state.id);
                }}
              >
                <i className="fa fa-trash" aria-hidden="true" /> &nbsp; Delete
              </Button>
              <Button
                type="button"
                className="btn btn-warning updateModalButton"
                disabled={!this.state.modalName_isValid || !this.state.modalCode_isValid}
                onClick={() => this.handleUpdateSocialMedia(this.state.id)}
              >
                <i className="fa fa-pencil" aria-hidden="true" /> &nbsp; Update
              </Button>
              <Button onClick={this.modalToggle} className="btn btn-primary cancelModalButton">
                <i className="fa fa-times-circle" aria-hidden="true" /> &nbsp; Cancel
              </Button>
            </div>
          </form>
        </SocialMediaModal>
      </Card>
    );
  }
}

export default SocialMediaList;
