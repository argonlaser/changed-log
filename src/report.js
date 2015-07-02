require('lazy-ass');
var check = require('check-more-types');

var log = console.log.bind(console);
var chalk = require('chalk');
var pkg = require('../package.json');
var utils = require('./utils');

function Report(options) {
  // TODO validate options
  la(check.object(options), 'missing options');

  this.options = options;
  this.ids = [];
  this.comments = [];
}

Report.prototype.print = function (opts) {
  var opts = opts || {};
  var report = this;
  log('Changelog for module', chalk.underline(report.options.name),
    'repo', chalk.underline(report.options.user + '/' + report.options.repo),
    'from', report.options.from, 'to', report.options.to);

  function shortenSha(str) {
    return str.substr(0, 7);
  }

  la(report.ids.length === report.comments.length,
    'mismatch in ids vs comments', report);

  report.ids.forEach(function (id, k) {
    var comment = report.comments[k] || '';
    if (!opts.details) {
      comment = utils.firstLine(comment);
    }
    log(chalk.bold(shortenSha(id)) + ': ' + comment);
  });

  log('Report generated by %s %s', pkg.name, pkg.homepage);
}

module.exports = Report;
