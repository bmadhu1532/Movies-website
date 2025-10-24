import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router'
import AccountPage from './components/account'
import MovieHomepage from './components/movieshomepage'
import PageNotFound from './components/pageNotFound'
import PopularPage from './components/popularpage'
import MovieItemDetails from './components/MovieItemDetails'
import ScrollToTop from './components/scrollTop'
import ProtectedRoute from './components/ProtectedRoute'
import SearchMovie from './components/SearchMovies'
import Login from './components/login'
import Register from './components/signup/Register'
// import Register from './components/signup/Register'


function App() {

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={<ProtectedRoute><MovieHomepage /></ProtectedRoute>}
        />
         <Route
          path="/home"
          element={<ProtectedRoute><MovieHomepage /></ProtectedRoute>}
        />
        <Route
          path="/popular"
          element={<ProtectedRoute><PopularPage /></ProtectedRoute>}
        />
        <Route
          path="/movies-app/movies/:movieId"
          element={<ProtectedRoute><MovieItemDetails /></ProtectedRoute>}
        />
        <Route
          path="/movies-app/movies-search"
          element={<ProtectedRoute><SearchMovie /></ProtectedRoute>}
        />
        <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
        <Route path='/login' element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  )
  
}

export default App
