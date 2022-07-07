import React from 'react';
import { Textarea } from '@mantine/core';
import PropTypes from 'prop-types';

class Message extends React.PureComponent {
  render() {
    return (
      <Textarea
        autosize
        placeholder="Enter message"
        label={this.props.label}
        value={this.props.value}
        onChange={this.props.onChange}
        required={!this.props.optional}
        minRows={this.props.rows}
      />
    );
  }
}

export default Message;

Message.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  rows: PropTypes.number,
  optional: PropTypes.bool.isRequired
};
