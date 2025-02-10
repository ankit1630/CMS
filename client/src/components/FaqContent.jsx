import React from 'react';
import PageHeader from "./PageHeader";
import { Modal, Button, Group } from '@mantine/core';
import "./../styles/faqContent.scss";
import xhr from "./../utils/xhr";
import Input from "./../widgets/Input";
import Message from "./../widgets/Message";

class FaqContent extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      faqContentModalIsOpened: false,
      faqContentIsLoading: true,
      schemaLoadIsInProgress:  true,
      faqsList: [],
      faqSchema: {},
      faqFormFields: [],
      inputValues: {},
      errorMsg: ""
    };
  }

  render() {
    return (
      <div className="faq-content">
        <PageHeader title="Faq Content" actions={this._getHeaderActions()}/>
        {this._renderFaqContentList()}
      </div>
    );
  }

  _renderFaqContentList() {
    const {faqContentIsLoading, faqsList} = this.state;

    if (faqContentIsLoading) {
      return <div className="faq-content__loading">Loading...</div>;
    }

    let faqsListEl = null;

    if (!faqsList.length) {
      faqsListEl =  <div className="faq-content__no-faqs">Add new faqs</div>;
    } else {
      faqsListEl =  <div className="faq-content__list">{this._renderFaqContentListItems()}</div>;
    }

    return (
      <>
        {faqsListEl}
        {this._renderFaqContentForm()}
      </>
    )
  }

  _renderFaqContentListItems() {
    return this.state.faqsList.map((faq) => {
      return (
        <section key={faq.id} className="faq-content__list-item">
          <h4 className="faq-content__list-item-title">{faq.title}</h4>
          <p className="faq-content__list-item-description">{faq.description}</p>
        </section>
      )
    });
  }

  _renderFaqContentForm() {
    if (!this.state.faqContentModalIsOpened) {
      return null;
    }

    return (
      <Modal
        opened={this.state.faqContentModalIsOpened}
        onClose={() => this._onToggleModal()}
        title="Add Faqs"
        centered
        size={600}
      >
        {this._renderError()}
        {this._renderLoadingScreen()}
        {this._renderFormFields()}
      </Modal>
    )
  }

  _renderLoadingScreen() {
    if (!this.state.schemaLoadIsInProgress) {
      return null;
    }

    return <div>Loading...</div>;
  }

  _renderError() {
    if (this.state.schemaLoadIsInProgress || !this.state.errorMsg) {
      return null;
    }

    return <div className="faq-content__error">{this.state.errorMsg}</div>;
  }

  _renderFormFields() {
    if (this.state.schemaLoadIsInProgress) {
      return null;
    }

    const formFieldEls = this.state.faqFormFields.map((field) => {
      return <div key={field.id}>{this._renderFields(field)}</div>;
    });

    return (
      <>
        {formFieldEls}
        <Group position="right" className="faq-content__modal-footer">
          <Button onClick={() => this._onSaveBtnClick()}>Save Faq</Button>
        </Group>
      </>
    );
  }

  _renderFields(field) {
    switch (field.type) {
      case "text":
        return this._renderInput(field.id, field.isOptional);
      case "message":
        return this._renderMessage(field.id, field.isOptional);
      default:
          return null;
    }
  }

  _renderInput(id, optional) {
    return (
      <>
        <Input
          value={this.state.inputValues[id].value}
          onChange={(ev) => this._onInputChange(ev, id)}
          label={id.toUpperCase()}
          optional={optional}
        />
        <br />
      </>
    )
  }

  _renderMessage(id, optional) {
    return (
      <>
        <Message
           value={this.state.inputValues[id].value}
          onChange={(ev) => this._onMessageChange(ev, id)}
          label={id.toUpperCase()}
          rows={8}
          optional={optional}
        />
        <br />
      </>
    )
  }

  _onInputChange(ev, id) {
    const updateInputValues = Object.assign({}, this.state.inputValues);

    updateInputValues[id].value = ev.target.value;
    this.setState({
      inputValues: updateInputValues
    });
  }

  _onMessageChange(ev, id) {
    const updateInputValues = Object.assign({}, this.state.inputValues);

    updateInputValues[id].value = ev.target.value;
    this.setState({
      inputValues: updateInputValues
    });
  }

  _onToggleModal() {
    this.setState({
      faqContentModalIsOpened: !this.state.faqContentModalIsOpened,
      schemaLoadIsInProgress: false,
      faqSchema: {},
      faqFormFields: [],
      inputValues: {},
      errorMsg: ""
    });
  }

  _getHeaderActions() {
    return [{
      label: "Add Faq",
      onClick: () => this._onAddFaq()
    }];
  }

  _onAddFaq() {
    this.setState({
      faqContentModalIsOpened: true,
      schemaLoadIsInProgress: true
    });

    this._fetchAndUpdateFaqSchema();
  }

  _fetchAndUpdateFaqSchema() {
    xhr({
      route: "https://cms-backend-ub99.onrender.com/api/faq-content/schema",
      onSuccess: (res) => {
        const schema = res.schema ? JSON.parse(res.schema) : null;
        const {inputValues, formFields} = this._processSchema(schema);

        this.setState({
          faqSchema: schema,
          faqFormFields: formFields,
          inputValues: inputValues,
          schemaLoadIsInProgress: false
        });
      }
    });
  }

  _processSchema(schema) {
    const keys = Object.keys(schema);

    const inputValues = {};
    const formFields = [];

    keys.forEach(key => {
      inputValues[key] = {
        value: "",
        error: ""
      };
      formFields.push({
        id: key,
        type: schema[key].type,
        isOptional: schema[key].is_optional
      });
    });

    return {inputValues, formFields};
  }

  _prepareFaqContentData() {
    const keys = Object.keys(this.state.inputValues);
    const xhrData = {};

    keys.forEach(key => {
      xhrData[key] = this.state.inputValues[key]?.value
    });

    return  xhrData;
  }

  _onSaveBtnClick() {
    xhr({
      route: "https://cms-backend-ub99.onrender.com/api/faq-content/add",
      method: "POST",
      data: this._prepareFaqContentData(),
      onSuccess: (res) => {
        this.setState({
          faqsList: [...this.state.faqsList, {
            id: res.id,
            title: this.state.inputValues["title"].value,
            description: this.state.inputValues["description"].value
          }]
        });
        this._onToggleModal();
      },
      onFailure: (err) => {
        this.setState({errorMsg: JSON.parse(err?.response)[0]?.message} || "")
      }
    });
  }

  componentWillMount() {
    fetch("https://cms-backend-ub99.onrender.com/api/faq-content").then((res) => res.json()).then((res) => {
      this.setState({
        faqContentIsLoading: false,
        faqsList: [...res]
      });
    });
  }
}

export default FaqContent;
