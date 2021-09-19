import { useState, useEffect } from 'react';
import { Link, Route, Switch, useHistory } from 'react-router-dom';
import './App.css';
import mapIcon from '../../assets/WorldMap.jpg';
import QuizPage from '../QuizPage/QuizPage';
import ErrorHandling from '../ErrorHandling/ErrorHandling';
import apiCalls from '../../api/apiCalls';
const { v4: uuidv4 } = require('uuid')


interface IState{
  countries: {
    name: string
    population: number
  }[],
  currentCountry: {
    name: string
    population: number
    capital: string
    borders: string[]
  } | undefined
  country: string
}

const App = () => {
  const [countries, setCountries] = useState<IState['countries']>([]);
  const [selectedCountry, setSelectedCountry]= useState<any>('Select A Country')
  const [error, setError] = useState<string>('');
  const [serverError, setServerError] = useState<string>('');
  const [displayCountry, setDisplayCountry] = useState<any>({})
  const history = useHistory();


   //|||||||||||||| PASSING ALL COUNTRY NAMES AS AN OPTION ||||||||||||||//

  const countryNames = countries.map(country => { 
    return (
      <option 
        key={uuidv4()}
        >{country.name}
      </option> 
    )
  })

     //|||||||||||||| FUNCTION TO FIND COUNTRY WITH MATCHING NAME FROM DROP DOWN ||||||||||||||//

  const getCurrentCountry = () => {
    const country = countries.find(currCountry => currCountry.name.includes(selectedCountry))
    setDisplayCountry(country);
  }

   //|||||||||||||| URROR HANDLE FOR SELECT DROP DOWN ||||||||||||||//

  const errorCheck = (e: any) => {
    e.preventDefault()
    if (selectedCountry.includes('Select A Country')) {
      setError('Please select a country')
    } else {
        handleSubmit(e)
    }
  }

  //|||||||||||||| BUTTON EVENT HANDLE HELPER FUNCTION  ||||||||||||||//

  const handleSubmit = (e:any) => {
    getCurrentCountry()
    history.push(`/${selectedCountry}`)
    setSelectedCountry('Select A Country') 
    setError('')
  }

  //|||||||||||||| UPDATING STATE ||||||||||||||//

  useEffect(() => {
    setServerError('');
    apiCalls.fetchCountriesData()
      .then((data) => setCountries(data))
      .catch((err) => {
        setServerError(err)
        history.push(`/country/${err}`)
      })
  }, [])

   //|||||||||||||| SETTING LOCAL STORAGE  ||||||||||||||//

  useEffect(() => {
    if (displayCountry.name) {
    localStorage.setItem('currentCountry', JSON.stringify(displayCountry));
    }
  }, [displayCountry])
  
  return (
    <div className="App">
      <header>
        <Link to="/" className="home-click">
          <h1>What In The World</h1>
        </Link>
      </header>
      <Switch>
        <Route exact path="/" render={ () => {
          return (
            <main className="mainDisplay">
              <section>
              <form 
                className="country-selector">
                <select 
                  className="country-dropdown"
                  onChange={(e) => setSelectedCountry(e.target.value)}>
                    <option value=''>
                    {selectedCountry}
                    </option>
                  options={countryNames} 
                </select>
                <button onClick={(e) => errorCheck(e)} 
                  className="dropdown-btn">
                  Submit Country
                </button>
                {error !== '' && <p className="input-error-message">{error}</p>}
              </form>
              </section>
              <img src={mapIcon} alt="world map" className="worldMapImg" />
            </main>
          )
        }
        }/>
        <Route exact path="/:country" render={ ({ match }) => {
          return ( 
            <QuizPage 
            name="country"
            currentCountry={displayCountry}
            country={displayCountry.name}
            />)
          }
        }/>
        <Route render={ () => {
          return <ErrorHandling errorMessage={serverError} /> 
        }}/>
      </Switch>
    </div>
  );
}

export default App;
