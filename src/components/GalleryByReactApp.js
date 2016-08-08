'use strict';

var React = require('react/addons');
// var ReactTransitionGroup = React.addons.TransitionGroup;

// CSS
require('normalize.css');
require('../styles/main.scss');

//获取图片相关的数据
var imageDatas = require('../data/imageDatas.json');

// var imageURL = require('../images/yeoman.png');
//利用自执行函数，将图片名信息转成图片URL路径
imageDatas = (function genImageURL(imageDataArr) {
  for (var i = 0, j = imageDataArr.length; i < j; i++) {
    var singleImageData = imageDataArr[i];

    singleImageData.imageURL = require('../images/' + singleImageData.fileName);

    imageDataArr[i] = singleImageData;
  }
  return imageDataArr;
})(imageDatas);


var GalleryByReactApp = React.createClass({
  render: function() {
    return (
      <section>
        <section className="stage"></section>
        <nav className="controller-nav"></nav>
      </section>
    );
  }
});
React.render(<GalleryByReactApp />, document.getElementById('content')); // jshint ignore:line

module.exports = GalleryByReactApp;
