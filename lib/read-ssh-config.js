'use strict';
const fs = require( 'fs' ).promises;
const os = require( 'os' );
const path = require( 'path' );
const HOME_DIR = os.homedir();


function read_ssh_config(){
   const path_config = path.join( HOME_DIR, '.ssh', 'config' );

   return fs.readFile( path_config, {
      encoding: 'utf8',
      flag: 'r'
   } );
}// /read_ssh_config()

module.exports = read_ssh_config;
