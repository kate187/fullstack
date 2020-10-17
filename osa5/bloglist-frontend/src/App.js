import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Toggleable from './components/Toggleable'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationStyle, setNotificationStyle] = useState('error');

  const blogFormRef = React.createRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs( blogs )
    }
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, [])


  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
      })
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
  
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token);
      console.log('user:');
      console.log(user);
      setUser(user)
      setUsername('')
      setPassword('')

      setNotificationMessage('Login succesful');
      setNotificationStyle('notice');
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)





    } catch (exception) {
      setNotificationMessage('wrong credentials')
      setNotificationStyle('error')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    console.log('Handling logout')
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken('')
    setUser(null)
  }

  const loginForm = () => (
    <div>
    <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          username
            <input id="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
    <div>
      password
        <input id="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
      />
      </div>
      <button id="login-button" type="submit">login</button>
      </form>
    </div>
  )

  const toggle = (blog) => {
      const nBlogs = blogs.map(b => ({...b}));
      nBlogs.map(b => b.showAll = b.id === blog.id ? !b.showAll : b.showAll)
      setBlogs(nBlogs)
  }

  const like = (blog) => {
    blog.likes = blog.likes + 1
    console.log("increment")
    blogService.update(blog.id, blog).then( res => {
      blogService.getAll().then(blogs => {
        setBlogs( blogs )
        console.log('updating blogs')
     })
    })
  }

  const deleteBlog = (blog) => {

    if (window.confirm("Are you sure?")) {
      blogService.deleteOne(blog.id)
    }
  }

  const compareBlog = (a, b) => {
    if(a.likes < b.likes)
      return 1
    else if(a.likes > b.likes)
      return -1
    
    return 0
  }

  const blogForm = () => (
    <div>
    <h2>{user.username} logged in</h2>
      {blogs.sort(compareBlog).map(blog =>{
        return <div key={blog.id}>
        <Blog key={blog.id} blog={blog}/>
        <button onClick={() => toggle(blog)}>view</button>
        <button onClick={() => like(blog)}>like</button>
        <button onClick={() => deleteBlog(blog)}>delete</button>
        </div>}
      )}
    <button onClick={handleLogout}>Logout</button>
    <Toggleable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Toggleable>
    </div>
  )
  
  const Notification = ({ message, style}) => {
    if (message === null) {
      return null
    }

    return (
      <div className={style}>
        {message}
      </div>
    )
  }

  return (
    <div>
    <Notification message={notificationMessage} style={notificationStyle} />
     {user === null ?
        loginForm() :
        blogForm()}
    </div>
  )
}

export default App
