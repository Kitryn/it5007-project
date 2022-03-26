class AboutUs extends React.Component {
  constructor() {
    super();
  }

  toggleTab(e) {
    e.preventDefault();
    // remove all active from the tabs on click
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((navLink) => {
      navLink.classList.remove('active');
    });

    // Add active on click
    e.target.classList.add('active');
    return null;
  }

  render() {
    return (
      <div className="p-5">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark g-0">
          <div className="container-fluid">
            <ul className="navbar-nav fs-5">
              <li className="nav-item mx-3">
                <a
                  className="nav-link active"
                  href="#"
                  onClick={(e) => this.toggleTab(e)}
                >
                  Home
                </a>
              </li>
              <li className="nav-item mx-3">
                <a
                  className="nav-link"
                  href="#"
                  onClick={(e) => this.toggleTab(e)}
                >
                  About Us
                </a>
              </li>
              <li className="nav-item mx-3">
                <a
                  className="nav-link"
                  href="#"
                  onClick={(e) => this.toggleTab(e)}
                >
                  Service
                </a>
              </li>
              <li className="nav-item mx-3">
                <a
                  className="nav-link"
                  href="#"
                  onClick={(e) => this.toggleTab(e)}
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

export default AboutUs;
