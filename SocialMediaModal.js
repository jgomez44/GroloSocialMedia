import React from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

class SocialMediaModal extends React.Component {
  render() {
    return this.props.modalShow ? (
      <div>
        <Modal isOpen={this.props.modalShow}>
          <ModalHeader />
          <ModalBody>{this.props.children}</ModalBody>
        </Modal>
      </div>
    ) : null;
  }
}

export default SocialMediaModal;
