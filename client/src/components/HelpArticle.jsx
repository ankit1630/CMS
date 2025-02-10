import React from 'react';
import PageHeader from "./PageHeader";
import { Modal, Button, Group } from '@mantine/core';
import "./../styles/helpArticle.scss";
import xhr from "./../utils/xhr";
import Input from "./../widgets/Input";
import Message from "./../widgets/Message";

const flatten = (ob) => {
  let result = {};
  for (const i in ob) {
      if ((typeof ob[i]) === 'object' && !Array.isArray(ob[i]) && ob[i].type === "object") {
          const temp = flatten(ob[i]);
          for (const j in temp) {
              result[j] = temp[j];
          }
      }
      else {
          result[i] = ob[i];
      }
  }
  delete result.type;
  return result;
};

class HelpArticle extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      helpArticleModalIsOpened: false,
      helpArticleIsLoading: true,
      schemaLoadIsInProgress: true,
      helpArticleList: [],
      title: "",
      subtitle: "",
      imageUrl: "",
      imageAltText: "",
      paragraph: ""
    };
  }

  render() {
    return (
      <div className="help-article">
        <PageHeader title="Help Article" actions={this._getHeaderActions()}/>
        {this._renderHelpArticlesList()}
      </div>
    );
  }

  _renderHelpArticlesList() {
    const {helpArticleIsLoading, helpArticleList} = this.state;

    if (helpArticleIsLoading) {
      return <div className="help-article__loading">Loading...</div>;
    }

    let helpArticleListEl = null;

    if (!helpArticleList.length) {
      helpArticleListEl =  <div className="help-article__no-faqs">Add new articles</div>;
    } else {
      helpArticleListEl =  <div className="help-article__list">{this._renderHelpArticlesListItems()}</div>;
    }

    return (
      <>
        {helpArticleListEl}
        {this._renderHelpArticleForm()}
      </>
    )
  }

  _renderHelpArticlesListItems() {
    return this.state.helpArticleList.map((faq) => {
      return (
        <section key={faq.id} className="help-article__list-item">
          <h4 className="help-article__list-item-title">{faq.title}</h4>
          <small className="help-article__list-item-subtitle">{faq.subtitle}</small>
          <p className="help-article__list-item-description">{faq.paragraph}</p>
        </section>
      )
    });
  }

  _renderHelpArticleForm() {
    if (!this.state.helpArticleModalIsOpened) {
      return null;
    }

    return (
      <Modal
        opened={this.state.helpArticleModalIsOpened}
        onClose={() => this._onToggleModal()}
        title="Add Help Article"
        centered
        size={600}
      >
        {this._renderLoadingScreen()}
        {this._renderFormFields()}
      </Modal>
    )
  }

  _renderLoadingScreen() {
    if (!this.state.schemaLoadIsInProgress) {
      return null;
    }

    return <div>Loading...</div>
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
        <Group position="right" className="help-article__modal-footer">
          <Button onClick={() => this._onSaveBtnClick()}>Save Help Article</Button>
        </Group>
      </>
    )
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
      helpArticleModalIsOpened: !this.state.helpArticleModalIsOpened,
      title: "",
      subtitle: "",
      imageUrl: "",
      imageAltText: "",
      paragraph: ""
    });
  }

  _getHeaderActions() {
    return [{
      label: "Add Help Article",
      onClick: () => this._onAddHelpArticle()
    }];
  }

  _onAddHelpArticle() {
    this._onToggleModal();
    this._fetchAndUpdateSchema();
  }

  _processSchema(schema) {
    schema = flatten(schema);
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

  _fetchAndUpdateSchema() {
    this.setState({
      schemaLoadIsInProgress: true
    });

    xhr({
      route: "https://cms-backend-ub99.onrender.com/api/help-article/schema",
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

  _getInputValues(id) {
    return this.state.inputValues[id].value;
  }

  _onSaveBtnClick() {
    fetch("https://cms-backend-ub99.onrender.com/api/help-article/add", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: this._getInputValues("title"),
        subtitle: this._getInputValues("subtitle"),
        image: {
          url: this._getInputValues("url"),
          alt_text: this._getInputValues("alt_text"),
        },
        paragraph: this._getInputValues("paragraph"),
      })
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Error in form");
      }
      return res.json();
    })
    .then((res) => {
      this.setState({
        helpArticleList: [...this.state.helpArticleList, {
          id: res.id,
          title: this._getInputValues("title"),
          subtitle: this._getInputValues("subtitle"),
          imageUrl: this._getInputValues("url"),
          imageAltText: this._getInputValues("alt_text"),
          paragraph: this._getInputValues("paragraph"),
        }]
      });

      this._onToggleModal();
    })
    .catch((err) => console.error("err", err));
  }

  componentWillMount() {
    fetch("https://cms-backend-ub99.onrender.com/api/help-article").then((res) => res.json()).then((res) => {
      this.setState({
        helpArticleIsLoading: false,
        helpArticleList: [...res]
      });
    });
  }
}

export default HelpArticle;
