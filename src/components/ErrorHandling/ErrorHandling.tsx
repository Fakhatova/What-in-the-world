import React from 'react';
import { Link } from 'react-router-dom';
import './ErrorHandling.css';

interface IErrorProps{
  errorMessage: string;
}

const ErrorHandling:React.FC<IErrorProps> = ({errorMessage}) => {
  return (
    <section className="error-display" >
      <img src='../../assets/error.png' alt="error icon" className="error-img" />
      <p>
        There was an issue!
      </p>
      <p className="error-message">
        {errorMessage}
      </p>
      <Link to="/" >
        <button>
          Take Me Home
        </button>
      </Link>
    </section>
  )
}

export default ErrorHandling;