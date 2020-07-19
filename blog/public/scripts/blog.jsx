import React from 'react';
import ReactDOM from 'react-dom';

import Navbar from '../components/Navbar/Navbar.jsx';
import Post from '../components/Post/Post.jsx';

function Page(props) {
  return (
    <div id='container'>
      <Navbar />
    </div>
  )
}

var data = new XMLHttpRequest();
var posts = [];
function onLoad() {
  let returnedPosts = JSON.parse(this.responseText);
  for (let i = 0; i < returnedPosts.data.length; i++) {
    let post = returnedPosts.data[i];
    posts.push(<div id='post' key={i}><Post title={post.title} date={post.date} content={post.body} postLink={post.post_link}/></div>);
  }

  function Page() {
    return (
      <div id='container'>
        <Navbar />
        {posts}
      </div>
    );
  }

  ReactDOM.render(
    <Page />,
    document.getElementById('root')
  );
  
}
data.addEventListener("load", onLoad);
data.open("GET", "/api?target=blog");
data.send();

