module.exports = function( gulp, config, args ) {

  var
       changelog = require( '../publish/changelog' )
    ,     colors = require( 'ansi-colors' )
    ,   fancylog = require( 'fancy-log' )
    ,         fs = require( 'fs' )
    , getVersion = require( '../lib/getVersion' )
    ,        git = require( '../publish/gitCommit' )
    ,    inquire = require( '../publish/inquire' )
    ,    request = require( 'request' )
    ,     rimraf = require( 'rimraf' )
    ,  svnCommit = require( '../publish/svnCommit' )
    ,     upload = require( '../publish/aws' )
  ;

  var auth = false,
      debug = args.debug || false,
      user_agent = 'lifterlms-lib-tasks-publish/' + config.publish.slug;

  function log_err( message ) {
    fancylog.error( colors.red( colors.bold( '[PUBLISH ERROR]' ) + ' ' + message ) );
  }

  function get_auth_file() {

    var filepath = require('os').homedir() + '/.llmsauth';

    if ( ! fs.existsSync( filepath ) ) {
      return false;
    }

    auth = JSON.parse( fs.readFileSync( filepath, 'utf8' ) );
    return true;

  }

  function gh_release_post( args, cb ) {

    return changelog.getDistNotes( function( notes ) {

      if ( debug ) {
        args.draft = true;
      }

      args.body = notes;

      return request.post( {
        url: 'https://api.github.com/repos/' + config.publish.github.org + '/' + config.publish.github.repo + '/releases?access_token=' + auth.github,
        headers: {
          'User-Agent': user_agent,
        },
        body: args,
        json: true,
      }, cb );

    } );

  }

  function post_results( results ) {

      var title = results.shift();

      fancylog( colors.blue( colors.bold( title ) ) );
      results.forEach( function( line ) {
        fancylog( colors.blue( line ) );
      } );

      if ( auth.slack ) {

        return request.post( {
          url: auth.slack,
          headers: {
            'User-Agent': user_agent
          },
          body: {
            channel: debug ? '#webhook-testing-spam' : config.publish.slack.channel,
            attachments: [
              {
                title: title,
                text: results.join( '\n' ),
                color: '#2295ff',
                footer: auth.author || 'LifterLMS',
                ts: Math.floor( Date.now() / 1000 ),
                image_url: config.publish.img,
              }
            ]
          },
          json: true,
        } );

      }
  };

  gulp.task( 'publish', function( cb ) {

    if ( ! get_auth_file() ) {
      return log_err( 'Missing Auth File, cannot proceed.' );
    }

    var opts = {
      ver: getVersion( args.V, config._package.version ),
      aws: ( auth.aws_id && auth.aws_secret && auth.aws_bucket ),
      gh: ( auth.github ),
      make: ( config.publish.lifterlms.make && auth.make_user && auth.make_pass ),
      pot: ( config.publish.lifterlms.pot && auth.translate_user && auth.translate_pass ),
      svn: ( config.publish.svn && auth.svn_user && auth.svn_pass ),
    };

    return inquire( opts, function( answers ) {

      // ensure tmp dir exists
      if ( ! fs.existsSync( './tmp' ) ) {
        fs.mkdirSync( './tmp' );
      }

      var to_process = []
          version = answers.version;

      /**
       * Update product metadata at LifterLMS.com
       * @since    [version]
       * @version  [version]
       */
      to_process.push( function( resolve, reject ) {

        if ( debug || ! auth.lifterlms || answers.gh_prerelease ) {
          return resolve( {} );
        }

        return request.post( {
          url: 'https://lifterlms.com/wp-json/llms-api/v2/release',
          headers: {
            'User-Agent': user_agent,
          },
          body: {
            apikey: auth.lifterlms,
            slug: config.publish.github.repo,
            version: version,
          },
          json: true,
        }, function( err, res, body ) {

          if ( err ) {
            return reject( err );
          }

          console.log( body );
          return resolve( {
            message: '*Product*: https://lifterlms.com/product/' + config.publish.lifterlms.slug,
          } );

        } );

      } );

      /**
       * Publish release notes as a blog post at make.lifterlms.com
       * @since    [version]
       * @version  [version]
       */
      to_process.push( function( resolve, reject ) {

        if ( ! answers.llms_pot ) {
          return resolve( {} );
        }

        return request.post( {
          url: 'https://translate.lifterlms.com/wp-json/llms-translate/v1/import',
          auth: {
            user: auth.translate_user,
            pass: auth.translate_pass,
          },
          headers: {
            'User-Agent': user_agent,
          },
          formData: {
            originals: fs.createReadStream( config.pot.dest + config.pot.domain + '.pot' ),
            project: config.pot.domain,
          },
        }, function( err, res, body ) {

          if ( err ) {
            return reject( err );
          }

          body = JSON.parse( body );

          if ( 200 !== res.statusCode ) {
            if ( body.message ) {
              return reject( body.message );
            }
            return reject( body );
          }

          return resolve( {
            message: '*Translation Import Results*: ' + body.message + '\n' + '*Translation Project*: https://translate.lifterlms.com/translate/projects/' + config.pot.domain + '/',
          } );

        } );

      } );

      /**
       * AWS: Upload Zip Dist file
       * @since    [version]
       * @version  [version]
       */
      to_process.push( function( resolve, reject ) {

        if ( ! answers.aws_upload ) {
          return resolve( {} );
        }

        var zipname = config.zip.name + '-' + version + '.zip';

        upload( auth, './' + config.zip.dest + zipname, 'dist/' + config.publish.slug + '/' + zipname, config.publish.privacy, function( err, data ) {

          if ( err ) {
            return reject( err );
          }

          return resolve( {
            message: '*Zip File*: ' + data.dl_url,
          } );

        } );

      } );

      /**
       * AWS: Upload MD Changelog
       * @since    [version]
       * @version  [version]
       */
      to_process.push( function( resolve, reject ) {

        if ( ! answers.aws_upload ) {
          return resolve( {} );
        }

        upload( auth, './CHANGELOG.md', 'changelogs/' + config.publish.slug + '.md', 'public', function( err, data ) {
          if ( err ) {
            return reject( err );
          }

          return resolve( {} );

        } );

      } );

      /**
       * AWS: Upload HTML Changelog
       * @since    [version]
       * @version  [version]
       */
      to_process.push( function( resolve, reject ) {

        if ( ! answers.aws_upload ) {
          return resolve( {} );
        }

        changelog.createHtmlFile( config, function( err ) {

          if ( err ) {
            return reject( err );
          }

          upload( auth, './tmp/changelog.html', 'changelogs/' + config.publish.slug + '.html', 'public', function( err, data ) {
            if ( err ) {
              return reject( err );
            }

            return resolve( {
              message: '*Changelog*: ' + data.Location,
            } );

          } );

        } );

      } );

      /**
       * Git: Create Branch, Tag, & Release
       * @since    [version]
       * @version  [version]
       */
      to_process.push( function( resolve, reject ) {

        if ( ! answers.gh_release ) {
          return resolve( {} );
        }

        git( gulp, config, version, function( err ) {
          if ( err ) {
            return reject( err );
          }

          gh_release_post( {
            tag_name: version,
            target_commitish: config.publish.github.branch,
            name: 'Version ' + version,
            prerelease: answers.gh_prerelease
          }, function( err, res, body ) {
            if ( err ) {
              return reject( err );
            }

            return resolve( {
              message: '*GitHub Release*: https://github.com/' + config.publish.github.org + '/' + config.publish.github.repo + '/releases/tag/' + version
            } );

          } );

        } );

      } );

      to_process.push( function( resolve, reject ) {

        if ( ! answers.svn ) {
          return resolve( {} );
        }

        svnCommit( gulp, config, version, auth, function( err ) {

          if ( err ) {
            return reject( err );
          }

          var base_url = config.publish.svn.base + '/' + config.publish.svn.slug;
              msgs = [
                '*SVN Trunk*: ' + base_url +'/trunk/',
                '*SVN Tag*: ' + base_url +'/tags/' + version + '/',
                '*SVN Zip*: https://downloads.wordpress.org/plugin/' + config.publish.svn.slug + '.' + version + '.zip',
              ];

          return resolve( {
            message: msgs.join( '\n' ),
          } );

        } );
      } );

      /**
       * Publish release notes as a blog post at make.lifterlms.com
       * @since    [version]
       * @version  [version]
       */
      to_process.push( function( resolve, reject ) {

        if ( ! answers.llms_make ) {
          return resolve( {} );
        }

        return changelog.getDistNotes( function( notes ) {

          var notes = notes.split( '\n' );
          notes.splice( 0, 3 );
          notes = notes.join( '\n' );

          notes = changelog.mdToHtml( notes );

          return request.post( {
            url: 'https://make.lifterlms.com/wp-json/wp/v2/posts',
            auth: {
              user: auth.make_user,
              pass: auth.make_pass,
            },
            headers: {
              'User-Agent': user_agent,
            },
            body: {
              status: debug ? 'draft' : 'publish',
              title: config.publish.title + ' Version ' + version,
              content: notes,
              categories: config.publish.lifterlms.make.cats,
              tags: config.publish.lifterlms.make.tags,
            },
            json: true,
          }, function( err, res, body ) {

            if ( err ) {
              return reject( err );
            }

            if ( -1 === [ 200, 201 ].indexOf( res.statusCode ) ) {
              if ( body.message ) {
                return reject( body.message );
              }
              return reject( body );
            }

            return resolve( {
              message: '*Blog Post*: ' + body.link + '\n',
            } );

          } );
        } )


      } );

      // Run all the processes
      // Post success / errors
      // on success posts to slack as well
      return Promise.all( to_process.map( function( func ) {

        return new Promise( func );

      } ) ).then( function( data ) {

        var msgs = [
          config.publish.title + ' Version ' + version,
        ];

        data.forEach( function( item ) {
          if ( item.message ) {
            msgs.push( item.message );
          }
        } );

        rimraf.sync( './tmp' );
        post_results( msgs );

      } ).catch( function( err ) {

        log_err( err );

      } );

    } );

  } );

};
