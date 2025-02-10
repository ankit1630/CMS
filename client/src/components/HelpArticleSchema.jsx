import React from 'react';
import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';
import { Button, Group } from '@mantine/core';
import "./../styles/helpArticleSchema.scss";
import xhr from "./../utils/xhr";

// const articleSchema = {
//   title: {
//     type: "text",
//     is_optional: false
//   },
//   subtitle: {
//     type: "text",
//     is_optional: false
//   },
//   image: {
//     url: {
//       type: "text",
//       is_optional: false
//     },
//     alt_text: {
//       type: "text",
//       is_optional: true
//     }
//   },
//   paragraph: {
//     type: "message",
//     is_optional: false
//   }
// };

class HelpArticleSchema extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      schema: null,
      uploadXhrIsInProgress: false,
      schemaLoadIsInProgress: true
    };
    this.editorRef = null;
  }
  render() {
    return (
      <div className="help-article">
          <div className="help-article_editor">
            {this.state.schema && <Editor
              mode="code"
              ref={(ref) => this._setEditorRef(ref)}
              value={this.state.schema}
              onChange={(schema) => this._onSchemaChange(schema)}
            />}
            <Group position="center" className="help-article__upload-btn">
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
      route: "https://cms-backend-ub99.onrender.com/api/help-article/upload-schema",
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
      route: "https://cms-backend-ub99.onrender.com/api/help-article/schema",
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

export default HelpArticleSchema;
