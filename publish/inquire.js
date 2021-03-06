function inquire( opts, cb ) {

  var inquirer = require( 'inquirer' );

  return inquirer.prompt( [

    {
      type: 'input',
      name: 'version',
      message: 'Version number',
      default: opts.ver,
    },
    {
      type: 'confirm',
      name: 'gh_release',
      message: 'Create a GitHub Release?',
      default: true,
      when: function( answers ) {
        return opts.gh;
      }
    },
    {
      type: 'confirm',
      name: 'gh_prerelease',
      message: 'Is this a pre-release?',
      default: false,
      when: function( answers ) {
        return ( opts.gh && answers.gh_release );
      }
    },
    {
      type: 'confirm',
      name: 'svn',
      message: 'Create an SVN release?',
      default: true,
      when: function( answers ) {
        return opts.svn;
      }
    },
    {
      type: 'confirm',
      name: 'aws_upload',
      message: 'Upload Changelog & Distribution Zip to AWS?',
      default: true,
      when: function( answers ) {
        return opts.aws;
      }
    },
    {
      type: 'confirm',
      name: 'llms_pot',
      message: 'Upload .pot file to translate.lifterlms.com?',
      default: true,
      when: function( answers ) {
        return opts.pot;
      }
    },
    {
      type: 'confirm',
      name: 'llms_make',
      message: 'Publish release notes to make.lifterlms.com?',
      default: true,
      when: function( answers ) {
        return opts.make;
      }
    },

  ] ).then( cb );

}

module.exports = inquire;

