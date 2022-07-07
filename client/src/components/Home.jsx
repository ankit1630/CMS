import React from 'react';
import { Link } from 'react-router-dom';
import "./../styles/home.scss";

class Home extends React.PureComponent {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div className="home-page">
        <h3>Faq content management system</h3>
        <p>You can create faq content and help articles.</p>
        <div className="home-page__btns">
          <Link type="button" to="/faq-content" className="home-page__btn">Faq Content</Link>
          <Link type="button" to="/help-article" className="home-page__btn">Help Article</Link>
        </div>
      </div>
    )
  }
}

export default Home;
