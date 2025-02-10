import React from 'react';
import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';
import { Button, Group } from '@mantine/core';
import "./../styles/faqSchema.scss";
import xhr from "./../utils/xhr";

// const faqContentSchema = {
//   title: {
//     type: "text",
//     is_optional: false
//   },
//   description: {
//     type: "message",
//     is_optional: false
//   }
// };

class FaqSchema extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      schema: null,
      uploadXhrIsInProgress: false
    };
    this.editorRef = null;
  }

  render() {
    console.log(this.state);
    return (
      <div className="faq-schema">
          <div className="faq-schema__editor">
            {this.state.schema && <Editor
              mode="code"
              ref={(ref) => this._setEditorRef(ref)}
              value={this.state.schema}
              onChange={(schema) => this._onSchemaChange(schema)}
            />}
            <Group position="center" className="faq-schema__upload-btn">
              <Button onClick={() => this._onUploadSchema()}>Upload Schema</Button>
            </Group>
          </div>
      </div>

    );
  }

  _setEditorRef(ref) {
    this.editorRef = ref;
  }

  _onSchemaChange(schema) {
    this.setState({schema: schema});

    if (this.editorRef) {
      this.editorRef.jsonEditor.set(schema);
    }
  }

  _onUploadSchema() {
    this.setState({uploadXhrIsInProgress: true});

    xhr({
      route: "https://cms-backend-ub99.onrender.com/api/faq-content/upload-schema",
      method: "POST",
      data: {schema: JSON.stringify(this.state.schema)},
      onSuccess: (res) => {
        console.log(res);
      },
      onEnd: () => {
        this.setState({uploadXhrIsInProgress: false});
      }
    });
  }

  componentWillMount() {
    xhr({
      route: "https://cms-backend-ub99.onrender.com/api/faq-content/schema",
      onSuccess: (res) => {
        const schema = res.schema ? JSON.parse(res.schema) : this.state.schema;
        this.setState({
          schema: schema,
          schemaLoadIsInProgress: false
        });

        if (this.editorRef) {
          this.editorRef.jsonEditor.set(this.state.schema);
        }
      }
    });
  }
}

export default FaqSchema;
