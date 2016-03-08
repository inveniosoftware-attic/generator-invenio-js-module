/*
 * This file is part of Invenio.
 * Copyright (C) 2016 CERN.
 *
 * Invenio is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * Invenio is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Invenio; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.
 *
 * In applying this license, CERN does not
 * waive the privileges and immunities granted to it by virtue of its status
 * as an Intergovernmental Organization or submit itself to any jurisdiction.
 */

'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('Invenio') + ' generator!'
    ));

    var prompts = [
      // required for package.json
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.appname
      },
      {
        type: 'input',
        name: 'description',
        message: 'Your project description',
        default: 'Description'
      },
      {
        type: 'input',
        name: 'version',
        message: 'Your project version',
        default: '0.0.1'
      },
      {
        type: 'input',
        name: 'author_name',
        message: 'Your project author',
        default: 'CERN',
      },
      {
        type: 'input',
        name: 'author_email',
        message: 'Your project author\'s email',
        default: 'info@invenio-software.org'
      },
      {
        type: 'input',
        name: 'repository',
        message: 'The full repository url',
        default: 'UPDATE_WITH_REPOSITORY_URL'
      },

      // required for deploy.sh
      {
        type: 'input',
        name: 'docs_user',
        message: 'The user which commits the docs after deploy',
        default: 'UPDATE_WITH_DOCS_USER'
      },
      {
        type: 'input',
        name: 'docs_email',
        message: 'The user\'s email which commits the docs after deploy',
        default: 'UPDATE_WITH_DOCS_USER_EMAIL'
      },

      // required for travis.yml
      {
        type: 'input',
        name: 'GH_REF',
        message: 'The GH_REF',
        default: 'UPDATE_WITH_GH_REF'
      },
      {
        type: 'input',
        name: 'GH_TOKEN',
        message: 'The GH_TOKEN',
        default: 'UPDATE_WITH_GH_TOKEN'
      },
      {
        type: 'input',
        name: 'npm_deploy_email',
        message: 'The npm user email',
        default: 'UPDATE_WITH_NPM_DEPLOY_EMAIL'
      },
      {
        type: 'input',
        name: 'npm_deploy_secret',
        message: 'The npm user api key',
        default: 'UPDATE_WITH_NPM_DEPLOY_SECRET'
      },
      {
        type: 'input',
        name: 'deploy_on_repo',
        message: 'In which repo to run deoloy on travis',
        default: 'UPDATE_WITH_DEPLOY_ON_REPO'
      },

    ];

    this.prompt(prompts, function (props) {
      this.props = props;
      done();
    }.bind(this));
  },

  writing: {

    // Copy the dot files

    dotfiles: function() {

      // .jsdoc
      this.fs.copyTpl(
        this.templatePath('_js_doc'),
        this.destinationPath('.jsdoc')
      );

      // .jshintrc
      this.fs.copyTpl(
        this.templatePath('_js_hint_rc'),
        this.destinationPath('.jshintrc')
      );

      // .license
      this.fs.copyTpl(
        this.templatePath('_license'),
        this.destinationPath('.license')
      );

      // .npmignore
      this.fs.copyTpl(
        this.templatePath('_npmignore'),
        this.destinationPath('.npmignore')
      );

      // .travis.yml
      this.fs.copyTpl(
        this.templatePath('_travis'),
        this.destinationPath('.travis.yml'), {
          GH_REF: this.props.GH_REF,
          GH_TOKEN: this.props.GH_TOKEN,
          npm_deploy_email: this.props.npm_deploy_email,
          npm_deploy_secret: this.props.npm_deploy_secret,
          deploy_on_repo: this.props.deploy_on_repo,
        }
      );
    },

    /////////////////////

    // Copy the confuguration files
    configuration: function() {

      // deploy.sh
      this.fs.copyTpl(
        this.templatePath('_deploy'),
        this.destinationPath('deploy.sh'), {
          docs_email: this.props.docs_email,
          docs_user: this.props.docs_user,
        }
      );

      // gulp.js
      this.fs.copyTpl(
        this.templatePath('_gulpfile'),
        this.destinationPath('gulpfile.js')
      );

      // karma-src.conf.js
      this.fs.copyTpl(
        this.templatePath('_karma_src_conf'),
        this.destinationPath('karma-src.conf.js')
      );

      // package.json
      this.fs.copyTpl(
        this.templatePath('_package'),
        this.destinationPath('package.json'), {
          author_email: this.props.author_email,
          author_name: this.props.author_name,
          description: this.props.description,
          name: this.props.name,
          repository: this.props.repository,
          version: this.props.version,
        }
      );
    },

    /////////////////////

    // Copy src folder
    src: function() {

      // src/app.module.js
      this.fs.copyTpl(
        this.templatePath('_app'),
        this.destinationPath('src/app/app.module.js')
      );
    },

    /////////////////////

    // Copy sample tests
    tests: function() {

      // src/app.spec.js
      this.fs.copyTpl(
        this.templatePath('_test'),
        this.destinationPath('test/unit/app/app.spec.js')
      );
    }
  },

  install: function () {
    this.log(
      chalk.red('READY!') + ' let\'s install all dependencies!'
    );
    this.installDependencies();
  }
});
