import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import './App.scss';
import Home from "./components/Home";
import FaqContent from "./components/FaqContent";
import HelpArticle from "./components/HelpArticle";
import FaqSchema from "./components/FaqSchema";
import HelpArticleSchema from "./components/HelpArticleSchema";

class App extends React.Component {
  render() {
    return (
      <Router>
          <div className="craft-demo-app">
            {this._renderNavBar()}
            <div className="craft-demo-app__content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/faq-schema" element={<FaqSchema />} />
                <Route path="/help-article-schema" element={<HelpArticleSchema />} />
                <Route path="/faq-content" element={<FaqContent />} />
                <Route path="/help-article" element={<HelpArticle />} />
              </Routes>
            </div>
          </div>
    </Router>
    );
  }

  _renderNavBar() {
    return (
      <nav className="craft-demo-app__navbar">
        <ul className="craft-demo-app__navbar-list">
          <li className="craft-demo-app__navbar-item">
            <Link className="craft-demo-app__navbar-item-link" to="/">Home</Link>
          </li>
          <li className="craft-demo-app__navbar-item">
            <Link className="craft-demo-app__navbar-item-link" to="/faq-schema">Faq Schema</Link>
          </li>
          <li className="craft-demo-app__navbar-item">
            <Link className="craft-demo-app__navbar-item-link" to="/help-article-schema">Help Article Schema</Link>
          </li>
          <li className="craft-demo-app__navbar-item">
            <Link className="craft-demo-app__navbar-item-link" to="/faq-content">Faq Content</Link>
          </li>
          <li className="craft-demo-app__navbar-item">
            <Link className="craft-demo-app__navbar-item-link" to="/help-article">Help Article</Link>
          </li>
        </ul>
      </nav>
    )
  }
}

export default App;
