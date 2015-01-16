var AppsStore = require('../stores/apps_store')
var App = require('./app.js.jsx')
var ProductSearch = require('./product_search.js.jsx')
var Spinner = require('./spinner.js.jsx')

var filters = [
  ['mine', 'My Apps'],
  ['live', 'Live'],
  ['trending', 'Trending'],
  ['new', 'New'],
]

var Apps = React.createClass({
  propTypes: {
    search: React.PropTypes.string.isRequired
  },

  render: function() {
    return <section className="tile-grid tile-grid-ideas">
      <div className="container main">
        <div className="header">
          <nav className="tile-grid-nav">
            <div className="item">
              <ul className="nav nav-pills">
                {_(filters).map(f => <li>
                    <a href={"/apps?filter=" + f[0]}>{f[1]}</a>
                  </li>
                )}
                {this.renderTopics()}
              </ul>
            </div>

            <div className="item">
              <form action="/apps">
                <input type="text" className="form-control" placeholder="Search Apps" name="search" defaultValue={this.props.search} />
              </form>
            </div>
          </nav>
        </div>

        {this.renderApps()}
      </div>
    </section>
  },

  renderApps: function() {
    if (this.state.apps == null) {
      return <Spinner />
    }
    return <div>
      {this.renderAppsList(_(this.state.apps).first(3))}

      <div className="col col-6 pr2 pb2">
        <a href={"/apps?topic=" + this.props.topics[0].slug} className="big-block-button">
          <div className="h7">Top Trending</div>
          {this.props.topics[0].hero_title}
        </a>
      </div>

      <div className="col col-6 pl2 pb2">
        <a href={"/apps?topic=" + this.props.topics[1].slug} className="big-block-button">
          <div className="h7">Top Trending</div>
          {this.props.topics[1].hero_title}
        </a>
      </div>

      {this.renderAppsList(_(this.state.apps).rest(3))}
    </div>
  },

  renderAppsList: function(apps) {
    return <div className="clearfix mt2">
      {_(apps).map(a =>
        <div className="col col-4 app">
          <App {...a} />
        </div>
      )}
    </div>
  },

  renderTopics: function() {
    return <li className="dropdown">
      <a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-expanded="false">
        Topics <span className="caret"></span>
      </a>
      <ul className="dropdown-menu" role="menu">
        {_(this.props.topics).map(f => <li>
          <a href={"/apps?topic=" + f.slug}>{f.name}</a>
          </li>
        )}
      </ul>
    </li>
  },

  getInitialState: function() {
    return this.getStateFromStore()
  },

  getStateFromStore: function() {
    return {
      apps: AppsStore.getApps()
    }
  },

  componentDidMount: function() {
    AppsStore.addChangeListener(this._onChange)
  },

  componentWillUnmount: function() {
    AppsStore.removeChangeListener(this._onChange)
  },

  _onChange: function() {
    this.setState(this.getStateFromStore())
  }

})

module.exports = window.Apps = Apps
