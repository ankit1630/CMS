import React from 'react';
import { TextInput } from '@mantine/core';
import PropTypes from 'prop-types';

class Input extends React.PureComponent {
  render() {
    return (
      <TextInput
        placeholder="Enter text"
        label={this.props.label}
        value={this.props.value}
        onChange={this.props.onChange}
        required={!this.props.optional}
      />
    );
  }
}

export default Input;

Input.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  optional: PropTypes.bool.isRequired
};
