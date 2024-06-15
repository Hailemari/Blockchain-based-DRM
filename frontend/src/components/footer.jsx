
const Footer = () => {
    const currentDate = new Date();

    return (
        <div className="footer">
        <div className="footer-content">
          <div className="footer-column">
            <h3>About Us</h3>
            <p>Our goal is protecting the digital content of every individual in Ethiopia and abroad.</p>
          </div>
          <div className="footer-column">
            <h3>Services</h3>
            <ul>
              <li>Upload contents</li>
              <li>Use contents</li>
              <li>Manage contents</li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Contact Us</h3>
            <p>Email: contact-bdrm@bdrm.com</p>
            <p>Phone: +123456789</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {currentDate.getFullYear()} BDRM. All rights reserved.</p>
        </div>
        </div>
    );
}

export default Footer;