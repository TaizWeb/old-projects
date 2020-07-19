// Bottleneck = API
// Keep working on this, if we can't speed up the api use ejs to give the data
// Making the initial call to the API to get the data used in the App
const apiReq = new XMLHttpRequest();
apiReq.addEventListener('load', onLoad, false);
let urlArray = window.location.href.split('/');
apiReq.open('GET', `${ urlArray[0] }/${ urlArray[1] }/${ urlArray[2] }/api?target=blog&post_link=the-future-of-the-self-taught-programmer`);
apiReq.send();
function onLoad() {
	const postData = JSON.parse(this.responseText);
	// Generating the App with the data from the AJAX call
	ReactDOM.render(React.createElement(App, { postData: postData }), document.getElementById('root'));
}

class PostHeading extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		let dateData = this.props.postDate.split('T')[0].split('-');
		let postDate = `${ months[dateData[1]] } ${ dateData[2] }, ${ dateData[0] }`;
		return React.createElement(
			'div',
			null,
			React.createElement(
				'h1',
				{ id: 'title' },
				this.props.postTitle
			),
			React.createElement(
				'p',
				{ id: 'date' },
				'Posted: ',
				postDate
			),
			React.createElement('hr', null)
		);
	}
}

class PostBody extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return React.createElement('div', { id: 'content', dangerouslySetInnerHTML: { __html: marked(this.props.postContent) } });
	}
}

class App extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		// Creating the post
		return React.createElement(
			'div',
			{ id: 'container' },
			React.createElement(
				'div',
				{ id: 'post-body' },
				React.createElement(PostHeading, { postTitle: this.props.postData.title, postDate: this.props.postData.date }),
				React.createElement(PostBody, { postContent: this.props.postData.body })
			)
		);
	}
}