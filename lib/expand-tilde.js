'use strict';
const os = require( 'os' );
const HOME_DIR = os.homedir();

function expand_tilde( cPath ){
   return cPath.replace( /^~/, HOME_DIR );
}// /expand_tilde()

module.exports = expand_tilde;
