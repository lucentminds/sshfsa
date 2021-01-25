#!/bin/node
const chalk = require( 'chalk' );

console.log( chalk.green( 'Installation success!' ) );
console.log( chalk.cyan( 'Don\'t forget to add the following line to your .bashrc file...' ) );
console.log( '\n# Map ssh autocompletion to the sshfsa command.\ncomplete -F _ssh sshfsa\n' );
