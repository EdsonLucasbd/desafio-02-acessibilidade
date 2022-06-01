import React, { useEffect, useState } from 'react';
import './App.css';
import { Loader } from './components/loader/Loader';
import { Star } from './components/Star';

function App() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [userAvaliation, setUserAvaliation] = useState(0);
  const [hasAvaliationError, setHasAvaliationError] = useState(false);
  const [hasNameError, setHasNameError] = useState(false);
  const [buttonStatus, setButtonStatus] = useState('Enviar')

  const nameError = <p role='alert' className='nameError'>Informe o seu nome</p>
  const rateError = <p role='alert' className='rateError'>Nos dê uma nota</p>

  function handleChangeModalVisibility(event) {
    if (event instanceof KeyboardEvent && event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    setIsVisible(!isVisible)
  }

  function handleNameChange(event) {
    const value = event.target.value;
    setName(value)
    if(value.length > 0) {
      hasNameError && setHasNameError(false)
    } else {
      setHasNameError(true)
    }
  }

  function handleMessageChange(event) {
    const value = event.target.value;
    setMessage(value)
  }

  useEffect(() => {
    console.log('avaliação', userAvaliation)
  }, [userAvaliation])

  function avaliation(event) {
    if (event instanceof KeyboardEvent && event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    
    event !== undefined
      && setUserAvaliation(event.target.getAttribute('data-star-id') || userAvaliation)
  }

  window.onclick = function (event) {
    if (event.target.id === 'myModal') {
      setIsVisible(!isVisible);
    }
  }

  function clearValues() {
    setName('')
    setMessage('')
    setUserAvaliation(0)
    setButtonStatus('Enviar')
  }

  function handleSendFeedback(event) {
    event.preventDefault();

    if (event.target.ariaDisabled === 'true') {
      if (name.length === 0 || userAvaliation === 0) {
        setHasNameError(true);
        setHasAvaliationError(true);
      }
      return;
    }

    if (name.length !== 0 && userAvaliation !== 0) {
      setHasNameError(false);
      setHasAvaliationError(false)
      console.log('entrou aqui', name.length !== 0 || userAvaliation !== 0)
      console.log(name.length, userAvaliation)

      let body = {
        userName: name,
        rating: userAvaliation,
        userMessage: message
      }
      setButtonStatus(<Loader size={24}/>)

      setTimeout(() => {
        fetch('https://5f4b11f341cb390016de37aa.mockapi.io/api/v1/feedback', {
          method: 'POST',
          body: JSON.stringify(body)
        }).then(function (response) {
          return response.json();
        }).then(function (data) {
          console.log(data);
        })

        setIsVisible(!isVisible);
        clearValues()
      }, 2000)

    }

  }

  return (
    <div className="App">
      <table className="container">
        <tbody>
          <tr>
            <td>
              <button
                tabIndex="0"
                id="myBtn"
                className="btn"
                aria-label='botão abrir modal'
                onClick={handleChangeModalVisibility}
              >
                Open Modal
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {isVisible &&
        <div id="myModal" className="modal">
          <div className="content">
            <form role='search' id="form" aria-labelledby='title'>
              <span
                tabIndex="0"
                className="close"
                aria-label='fechar'
                onClick={handleChangeModalVisibility}
                onKeyPress={handleChangeModalVisibility}
                role='button'
              >
                &times;
              </span>
              <legend className="title" id='title'>Deixa seu feedback</legend>
              <div className={hasNameError ? 'form-group nameFieldError' : 'form-group'}>
                <label 
                  htmlFor='name' 
                  className={
                    hasNameError ? 'fieldHasError' : ''
                }>
                  Seu nome:
                </label>
                <input
                  type="text"
                  id="name"
                  name='seuNome'
                  className={hasNameError ? 'inputFieldError' : ''}
                  onChange={handleNameChange}
                  autoComplete="name"
                  aria-required="true"
                  aria-invalid={hasNameError}
                  autoFocus
                />
              </div>
              <div className={hasNameError ? 'fieldError showError' : 'fieldError'}>
                {hasNameError && nameError}
              </div>

              <fieldset
                tabIndex='0'
                className="form-group"
                aria-labelledby='ratingTitle'
              >
                <legend
                  htmlFor='rating'
                  id='ratingTitle'
                  className={hasAvaliationError ? 'fieldHasError' : ''}
                >
                  Sua nota:
                </legend>
                <div id="rating">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      starId={index + 1}
                      key={`star_${index + 1}`}
                      marked={userAvaliation && userAvaliation >= index + 1}
                      onClick={avaliation}
                    />
                  ))}
                </div>
              </fieldset>
              <div className={hasAvaliationError ? 'fieldError showError' : 'fieldError'}>
                {hasAvaliationError && rateError}
              </div>

              <div className="form-group">
                <label htmlFor='message'>Sua mensagem:</label>
                <textarea
                  id="message"
                  onChange={handleMessageChange}
                ></textarea>
              </div>
              <button
                tabIndex="0"
                id="sendFeedback"
                aria-label='botão enviar feedback'
                className="btn"
                onClick={handleSendFeedback}
                aria-disabled={name.length === 0 || userAvaliation === 0}
                aria-describedby='disabledReason'
              >
                {buttonStatus}
                <span 
                  aria-live="assertive" 
                  className="srOnly" 
                  data-loading-msg='Enviando feedback, aguarde...'>
                </span>
              </button>
            </form>
          </div>
        </div>
      }
    </div>
  );
}

export default App;
