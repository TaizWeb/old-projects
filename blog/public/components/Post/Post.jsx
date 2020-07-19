import React from 'react';
import ReactDOM from 'react-dom';
import marked from 'marked';
let renderer = new marked.Renderer();
renderer.image = function(href, title, text) {
	var out = '<div id="image_wrapper"><img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '/></div>';
  return out;
}

export default class Post extends React.Component {
	constructor(props) {
		super(props);
		const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		// Making the date object into a readable string
		this.date = `${months[parseInt(this.props.date.split("T")[0].split("-")[1])-1]} ${this.props.date.split("T")[0].split("-")[2]}, ${this.props.date.split("T")[0].split("-")[0]}`;
		// Replacing html-safe characters with actual characters
		this.content = marked(this.props.content.replace(/&apos;/g, "\'").replace(/&quot;/g, "\"").replace(/&#96;/g, "\`"), { renderer: renderer });
	}

	render() {
		return (
			<div id='post'>
				<a id='post-link' href={'http://' + window.location.host + '/blog/post/' + this.props.postLink}><h2 id='post-title'>{this.props.title}</h2></a>
				<p id='post-date'>{this.date}</p>
				<br />
				<p id='post-content' dangerouslySetInnerHTML={{__html: this.content}}></p>
			</div>
		);
	}
}
