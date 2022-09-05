import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class App extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    projectsList: [],
    userSelectItem: categoriesList[0].id,
  }

  componentDidMount() {
    this.getProjects()
  }

  getProjects = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {userSelectItem} = this.state

    const api = `https://apis.ccbp.in/ps/projects?category=${userSelectItem}`

    const options = {
      method: 'GET',
    }

    const response = await fetch(api, options)
    if (response.ok === true) {
      const data = await response.json()

      const fetchedData = data.projects.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        imageUrl: eachItem.image_url,
      }))
      this.setState({
        projectsList: fetchedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onChangeSelect = event => {
    this.setState({userSelectItem: event.target.value}, this.getProjects)
  }

  renderSuccessView = () => {
    const {projectsList} = this.state

    return (
      <ul className="ul-projects-items">
        {projectsList.map(eachItem => (
          <li key={eachItem.id} className="li-item">
            <img
              src={eachItem.imageUrl}
              alt={eachItem.name}
              className="proj-img"
            />
            <p>{eachItem.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-div">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="fail-image"
      />
      <h1 className="fail-heading">Oops! Something Went Wrong</h1>
      <p className="fail-para">
        We cannot seem to find the page you are looking for
      </p>
      <button
        className="btn-retry"
        type="button"
        onClick={() => this.getProjects()}
      >
        Retry
      </button>
    </div>
  )

  renderProjects = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {userSelectItem} = this.state

    return (
      <div className="app-container">
        <nav className="nav-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo-img"
          />
        </nav>
        <div className="projects-container">
          <select
            className="select-element"
            onChange={this.onChangeSelect}
            value={userSelectItem}
          >
            {categoriesList.map(eachItem => (
              <option key={eachItem.id} value={eachItem.id} className="option">
                {eachItem.displayText}
              </option>
            ))}
          </select>
          {this.renderProjects()}
        </div>
      </div>
    )
  }
}

export default App
