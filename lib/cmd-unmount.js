
const child_process = require('child_process');
const spawn = child_process.spawn;
const get_sshfs_mounts = require( './get-sshfs-mounts' );

module.exports = function( o_args ){
   const c_host = o_args.unmount === true ?o_args._[0] :o_args.unmount;

   if( !c_host && !o_args.all ) {
      console.error( 'Host is missing or invalid.' );
      process.exit( 1 );
   }

   return get_sshfs_mounts()
   .then(function( a_mounts ){
      var i, l, o_sshfs_mount = null;

      if( !!o_args.all ){
         return unmount_all( a_mounts );
      }

      for ( i = 0, l = a_mounts.length; i < l; i++ ) {
         if( a_mounts[i].host == c_host ){
            o_sshfs_mount = a_mounts[i];
            break;
         }
      }// /for()

      if( !o_sshfs_mount ){
         // console.log( '\n\n', JSON.stringify( a_mounts ),'\n\n' );
         console.error( `Host ${c_host} not mounted.` );
         process.exit( 1 );
      }

      return unmount_sshfs_mount( o_sshfs_mount );
   });

};

const unmount_sshfs_mount = function( o_sshfs_mount ){
   return new Promise(function( resolve, reject ){
      const child = spawn( 'fusermount', [ '-u', o_sshfs_mount.local_path ] );

      child.stdin.setEncoding( 'utf-8' );
      process.stdin.pipe(child.stdin);
      child.stdout.pipe(process.stdout);
      // child.stderr.pipe(process.stdout);
      child.stderr.on( 'data',function( c_data ){
         reject( c_data.toString( 'utf8' ) );
      });
      child.on( 'close',function(){
         console.log( 'released', o_sshfs_mount.local_path );
         resolve();
      });
   });
};// /unmount_sshfs_mount()

const unmount_all = function( a_mounts ){
   const a_promises = [];

   a_mounts.forEach(function( o_mount ) {
      a_promises.push( unmount_sshfs_mount( o_mount ) );
   });

   return Promise.all( a_promises );
};// /unmount_all()