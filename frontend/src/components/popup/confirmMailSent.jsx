
import React from 'react'
import propTypes from 'prop-types'
const ConfirmMailSent = (props) => {
    return (
      <div>
        <div className="verification-mail">
          <div style={{ textAlign: 'center' }} className="confirm-mail-card">
            <h1 style={{ fontSize: '28px', fontWeight: '600' }}>{props.msg}</h1>
            <p className="confirm-mail-p" style={{ fontSize: '16px' }}>
              {props.p1} <br />
              {props.p2}
            </p>
            <img
              style={{ marginTop: '40px' }}
              width="50%"
              height="60%"
              src="/Assets/Img/png/mail.png"
            />
          </div>
        </div>
      </div>
    )
  }
  
ConfirmMailSent.propTypes = {
    msg: propTypes.string,
    p1: propTypes.string,
    p2: propTypes.string,
  }
  
  export default ConfirmMailSent