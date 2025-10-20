import './index.css';

import React from 'react';
import { Route, Routes } from 'react-router-dom';  


import HomePage from './pages/HomePage';
import AboutUs from './pages/AboutUs';
import NotFound from './pages/NotFound';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/Login';
import CourseList from './pages/coursePage/CourseList';
import ContactUs from './pages/ContactUs';
import Denied from './pages/denied';
import CourseDescription from './pages/coursePage/CourseDescription';
import RequireAuth from './componet/RequireAuth';
import CreateCourse from './pages/coursePage/CreateCourse';
import Profile from './pages/user/Profile';
import EditProfile from './pages/user/EditProfile';
import EvintMainPage from './pages/Evintlist/EvintMainPage';
import Search from './pages/AddToFrind/Search';
import Followinguser from './pages/user/followinguser';
import AddPost from './pages/user/AddPost';
import Feed from './pages/user/Feed';
import Chating from './pages/Chating/Chating';


function App() {
  return (
   <>
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/about' element={<AboutUs/>} />
      <Route path='/signup' element={<SignupPage/>}/>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/allCourse' element={<CourseList/>}/>
      <Route path='/contact' element={<ContactUs/>}/>
      <Route path='/denied' element={<Denied/>}/>
      <Route path='/course/description' element={<CourseDescription/>}/>
      <Route element={<RequireAuth allowedRolse={["ADMIN"]}/>}>
      <Route path='/course/create' element={<CreateCourse/>}/>
      </Route>
      <Route element={<RequireAuth allowedRolse={["ADMIN","user"]}/>}>
      <Route path='/user/profile' element={<Profile/>}/>
      <Route path='/user/editprofile' element={<EditProfile/>}/>
      <Route path='/evint' element={<EvintMainPage/>}/>
      <Route path='/profile' element={<Followinguser/>}/>
      <Route path='/search'element={<Search/>}/>
      <Route path='/addPost' element={<AddPost/>}/>
      <Route path='/feed' element={<Feed/>}/>
      <Route path='/chating' element={<Chating/>}/>
      </Route>
      <Route path='*' element={<NotFound/>} />
    </Routes>
   </>
  )
}

export default App
