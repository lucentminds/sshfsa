/**
 * 05-02-2018
 * The best app ever..
 * ~~ Scott Johnson
 */


/** List jshint ignore directives here. **/
/* jshint undef: true, unused: true */
/* jslint node: true */
/* jshint esversion:6 */
/* eslint-env es6 */

const Q = require( 'q' );
const REG_HOST = /^Host (.+)$/;
const REG_VALUE = /^\s+(?:#\s*)?([a-zA-Z0-9_]+) (.+)$/;
const parse = module.exports = function( cConfig ){ // jshint ignore:line
   const deferred = Q.defer();
   var i, l, aLines = cConfig.split( /\r\n|\n/ ), cLine;
   var aHosts = [], oHost, aValue;

   // Loop over each line and determine the value
   for( i = 0, l = aLines.length; i < l; i++ ) {
      cLine = aLines[ i ];

      if( REG_HOST.test( cLine ) ) {
         // New host entry.
         oHost = {
            Host: cLine.match( REG_HOST )[1]
         };

         aHosts.push( oHost );
         continue;
      }// /if()

      if( !cLine.trim() ) {
         // This is a new blank line. Most likely after a whole entry.
         continue;
      }

      aValue = cLine.match( REG_VALUE );

      if( aValue ) {
         oHost[ aValue[ 1 ] ] = aValue[ 2 ];
      }

   }// /for()
   
   deferred.resolve( aHosts );

   return deferred.promise;
};// /parse()