require('lazy-ass');
var check = require('check-more-types');
var Promise = require('bluebird');
var R = require('ramda');
var debug = require('debug')('changed');
var packageField = require('package-json');
var utils = require('./utils');
/* eslint no-console:0 */
var log = console.log.bind(console);

function getRepo(info) {
  if (check.object(info.repository)) {
    return info.repository;
  }

  la(check.object(info.versions), 'missing versions', info);
  var latestTag = R.last(Object.keys(info.versions));
  var latest = info.versions[latestTag];
  return latest.repository;
}

// resolves with the github url for the given NPM package name
function packageRepo(name) {
  la(check.unemptyString(name), 'missing package name', name);

  if (utils.isGithubName(name)) {
    debug('package name "%s" is repo', name);
    return Promise.resolve(utils.parseGithubName(name));
  }

  debug('getting package repo for "%s"', name);
  var json;

  return Promise.resolve(packageField(name))
    .then(R.tap(debug))
    .tap(function (info) {
      json = info;
    })
    .then(getRepo)
    .then(function (repo) {
      debug('just the repo', repo);
      utils.verifyGithub(json, repo);
      return repo;
    })
    .then(R.prop('url'))
    .then(utils.parseGithubUrl);
}

module.exports = packageRepo;

if (!module.parent) {
  (function () {
    // var name = 'next-update';
    var name = 'grunt-contrib-jshint';
    log('getting repo info for package %s', name);
    packageRepo(name)
      .then(log)
      .catch(log);
  }());
}
