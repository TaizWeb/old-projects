import React from 'react';
import ReactDOM from 'react-dom';
import marked from 'marked';

import Navbar from '../components/Navbar/Navbar.jsx';
import Post from '../components/Post/Post.jsx';

function Page(props) {
	return (
		<div id='container'>
			<Navbar />
			<Post title={props.postTitle} date={props.postDate} content={props.postBody} postLink={props.postLink} />
		</div>
	);
}

function onLoad() {
	var PostData = JSON.parse(this.responseText);
	ReactDOM.render(
		<Page
			postTitle={PostData.title}
			postDate={PostData.date}
			postBody={PostData.body}
			postLink={PostData.post_link}
		/>,
		document.getElementById('root')
	);
}

var data = new XMLHttpRequest();
data.addEventListener("load", onLoad);
let postLink = window.location.pathname.split("/");
postLink = postLink[postLink.length -1];

data.open("GET", "/api?target=blog&post_link=" + postLink);
data.send();
