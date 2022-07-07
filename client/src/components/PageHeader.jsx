import React from 'react';
import "../styles/pageHeader.scss";
import PropTypes from 'prop-types';
import { Button } from '@mantine/core';

export default class PageHeader extends React.PureComponent {
  render() {
    const {title} = this.props;
    return (
      <header className="page-header">
        <section className="page-header__left">
          <strong>{title}</strong>
        </section>
        <section className="page-header__right">{this._renderActions()}</section>
      </header>
    )
  }

  _renderActions() {
    const actionEls = this.props.actions.map((action, id) => {
      const key = action.title + id;
      return <Button key={key} className="page-header__action-btn" onClick={action.onClick}>{action.label}</Button>
    });

    return <div className="page-header__actions">{actionEls}</div>;
  }
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  actions: PropTypes.array
};
