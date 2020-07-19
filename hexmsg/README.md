## HELP WANTED
Currently we are in the process of adding emoji support to HEXMSG! Since there are such a vast amount of emoji out there, we're accepting any/all help trying to document them all. Simply add another entry to the current emoji json file (found at /public/js/emoji.js in the PROD branch) and make a pull request, I will accept your contributions as soon as I can, thanks for your continued support!

## HEXMSG
HEXMSG is an anonymous, fast, and transparent messaging service, built on NodeJS and Socket.io. This is **not** meant to be secure channel, as this would be nearly impossible to monitor considering how accessible the server is.

## Contributions
The project is entirely open to outside contributions and additions. If you would like to contribute to the project, simply make a fork of the repository and edit it, then make a pull request. From there, one of our contributors will approve of it and merge the request. However, we have a few general guidelines that should be followed:
- Follow the current programming styles/practices, such as using tabs for indentation rather than spaces.
- In the event of a merge conflict, accept that some of your changes may be discarded for more favorable ones.
- Make use of the Issue Tracker, please consider attempting to fix a bug rather than implement an entirely new feature, as bugs are top priority.

## Setup
Things you'll need:
- A command line with Git and NodeJS installed on it

Setting up the server:

1. Clone the repository by entering the following into your command line: ```git clone https://github.com/TaizWeb/hexmsg.git```this will create a folder named 'hexmsg' in the current directory, navigate to this by entering: ```cd hexmsg```

2. Enter ```npm install``` into your command line, this will install all the project's dependencies.

3. Add an environment variable named "hashingSecret" into your command line. This will be used in generating the sha256 hashes.

4. If everything went right, entering ```node server``` will launch the server onto localhost:8000.

5. Everything should now be working properly, congrats!

## Using the CLI client:
Follow everything to step 2 from the Setup section, after that, run ```node client <desired host>``` to connect to a HEXMSG room.

For example, entering ```node client localhost:8000``` would connect you to your localhost server, assuming it's currently running.

## Contributors
Current contributors of the project:
- [Dalton](https://github.com/daltonedwards) (developer of the majority of the front-end, lead front-end developer, and project manager)
- [Manasseh](https://github.com/ManassehPierce) (rewriter of the front end and current lead front end developer and bug-fixer)
- [Walter](https://github.com/taizweb) (developer of the majority of the back-end, lead back-end developer, and repository maintainer)
