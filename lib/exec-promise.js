

const child_process = require('child_process');

module.exports = function( c_command ){
   return new Promise(function( resolve, reject ){
      child_process.exec( c_command, function( error, stdout, stderr ){
         if( error ){
            return reject( error );
         }

         resolve({
            stdout: stdout,
            stderr: stderr,
         });
      });
   });
};// /exec()
