'use strict';

var React = require('react/addons');
// var ReactTransitionGroup = React.addons.TransitionGroup;

// CSS
require('normalize.css');
require('../styles/main.scss');

//获取图片相关的数据
var imageDatas = require('../data/imageDatas.json');

//利用自执行函数，将图片名信息转成图片URL路径
imageDatas = (function genImageURL(imageDataArr) {
    for (var i = 0, j = imageDataArr.length; i < j; i++) {
        var singleImageData = imageDataArr[i];

        singleImageData.imageURL = require('../images/' + singleImageData.fileName);

        imageDataArr[i] = singleImageData;
    }
    return imageDataArr;
})(imageDatas);

/**
 * 取值随机数
 */
function getRangeRandom(min, max) {
    return Math.ceil(Math.random() * (max - min) + min);
}

/*
 * 获取 0~30° 之间的一个任意正负值
 */
function get30DegRandom() {
    return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}

var ImgFigure = React.createClass({

    // 点击图片
    handleClick: function (e) {

        if (this.props.arrange.isCenter) {
            this.props.inverse();
        } else {
            this.props.center();
        }

        e.stopPropagation();
        e.preventDefault();
    },

    render: function () {

        var styleObj = {};

        // 如果props属性中指定了这张图片的位置，则使用
        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        }

        // 如果图片的旋转角度有值并且不为0， 添加旋转角度
        if (this.props.arrange.rotate) {
            (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function (value) {
                styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
            }.bind(this));
        }

        // 如果是居中的图片， z-index设为11
        if (this.props.arrange.isCenter) {
            styleObj.zIndex = 11;
        }

        var imgFigureClass = 'img-figure';
        imgFigureClass += this.props.arrange.isInverse ? ' is-inverse' : '';

        return (
            <figure className={imgFigureClass} style={styleObj}
                    onClick={this.handleClick}>
                <img src={this.props.data.imageURL}
                     alt={this.props.data.title}/>
                <figcaption>
                    <h2 className="img-title">
                        {this.props.data.title}
                    </h2>
                    <div className="img-back">
                        <p>{this.props.data.desc}</p>
                    </div>
                </figcaption>
            </figure>
        );
    }
});

var ControllerUnit = React.createClass({
    handleClick: function (e) {
        if (this.props.arrange.isCenter) {
            this.props.inverse();
        } else {
            this.props.center();
        }

        e.stopPropagation();
        e.preventDefault();
    },

    render: function () {

        var controlelrUnitClassName = 'controller-unit';

        if (this.props.arrange.isCenter) {
            controlelrUnitClassName += ' is-center';

            if (this.props.arrange.isInverse) {
                controlelrUnitClassName += ' is-inverse';
            }
        }

        return (
            <span className={controlelrUnitClassName}
                  onClick={this.handleClick}></span>
        );
    }
});

var GalleryByReactApp = React.createClass({
    Constant: {
        centerPos: {
            left: 0,
            top: 0
        },
        hPosRange: {  //水平方向取值范围
            leftSecX: [0, 0],
            rightSecX: [0, 0],
            y: [0, 0]
        },
        vPosRange: {  //垂直方向取值范围
            x: [0, 0],
            topY: [0, 0]
        }
    },

    getInitialState: function () {
        return {
            imgsArrangeArr: []
        };
    },

    /*
     * 利用arrange函数， 居中对应index的图片
     * @param index, 需要被居中的图片对应的图片信息数组的index值
     * @returns {Function}
     */
    center: function (index) {
        return function () {
            this.rearrange(index);
        }.bind(this);
    },

    /*
     * 翻转图片
     * @param index 传入当前被执行inverse操作的图片对应的图片信息数组的index值
     * @returns {Function} 这是一个闭包函数, 其内return一个真正待被执行的函数
     */
    inverse: function (index) {
        return function () {
            var imgsArrangeArr = this.state.imgsArrangeArr;

            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
            this.setState({
                imgsArrangeArr: imgsArrangeArr
            });
        }.bind(this);
    },

    //组件加载以后，为每张图片计算其位置的范围
    componentDidMount: function () {
        var stageDOM = React.findDOMNode(this.refs.stage),
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);

        var imgFigureDOM = React.findDOMNode(this.refs.imgFigure1),
            imgFigureW = imgFigureDOM.scrollWidth,
            imgFigureH = imgFigureDOM.scrollHeight,
            halfFigureW = Math.ceil(imgFigureW / 2),
            halfFigureH = Math.ceil(imgFigureH / 2);

        //中间图片的位置
        this.Constant.centerPos = {
            left: halfStageW - halfFigureW,
            top: halfStageH - halfFigureH
        };

        //计算左侧，右侧区域图片排布位置的取值范围
        this.Constant.hPosRange.leftSecX[0] = -halfFigureW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfFigureW * 3;
        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfFigureW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfFigureW;
        this.Constant.hPosRange.y[0] = -halfStageH;
        this.Constant.hPosRange.y[1] = stageH - halfStageH;

        //计算上侧区域图片排布位置的取值范围
        this.Constant.vPosRange.x[0] = halfStageW - halfFigureW;
        this.Constant.vPosRange.x[1] = halfStageW;
        this.Constant.vPosRange.topY[0] = -halfFigureH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfFigureH * 3;

        this.rearrange(0);
    },

    /**
     * 重新布局所有图片
     * @param centerIndex 指定居中排布哪个图片
     */
    rearrange: function (centerIndex) {
        var imgsArrangeArr = this.state.imgsArrangeArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,

            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,

            vPosRangeX = vPosRange.x,
            vPosRangeTopY = vPosRange.topY,

            imgsArrangeTopArr = [],
            topImgNum = Math.floor(Math.random() * 2),// 取一个或者不取
            topImgSpliceIndex = 0,

            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

        // 居中centerIndex图片, 居中的 centerIndex 的图片不需要旋转
        imgsArrangeCenterArr[0] = {
            pos: centerPos,
            rotate: 0,
            isCenter: true,
            isInverse: false
        };

        // 取出要布局上侧的图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

        //布局位于上侧的图片
        imgsArrangeTopArr.forEach(function (value, index) {
            imgsArrangeTopArr[index] = {
                pos: {
                    left: getRangeRandom(vPosRangeX[0], vPosRangeX[1]),
                    top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1])
                },
                rotate: get30DegRandom(),
                isCenter: false,
                isInverse: false
            };
        });

        // 布局左右两侧的图片
        for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
            var hPosRangeLORX = null;

            // 前半部分布局左边， 右半部分布局右边
            if (i < k) {
                hPosRangeLORX = hPosRangeLeftSecX;
            } else {
                hPosRangeLORX = hPosRangeRightSecX;
            }

            imgsArrangeArr[i] = {
                pos: {
                    top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                    left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                },
                rotate: get30DegRandom(),
                isCenter: false,
                isInverse: false
            };

        }

        if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        this.setState({
            imgsArrangeArr: imgsArrangeArr
        });
    },

    render: function () {
        var controllerUnits = [],
            imgFigures = [];

        imageDatas.forEach(function (value, index) {

            if (!this.state.imgsArrangeArr[index]) {
                this.state.imgsArrangeArr[index] = {
                    pos: {
                        left: 0,
                        top: 0
                    },
                    rotate: 0,
                    isCenter: false,
                    isInverse: false
                };
            }

            imgFigures.push(<ImgFigure key={index}
                                       data={value}
                                       arrange={this.state.imgsArrangeArr[index]}
                                       center={this.center(index)}
                                       inverse={this.inverse(index)}
                                       ref={'imgFigure' + index}/>);

            controllerUnits.push(<ControllerUnit key={index}
                                                 arrange={this.state.imgsArrangeArr[index]}
                                                 center={this.center(index)}
                                                 inverse={this.inverse(index)}/>);
        }.bind(this));

        return (
            <section className="stage" ref="stage">
                <section className="img-sec">
                    {imgFigures}
                </section>
                <nav className="controller-nav">
                    {controllerUnits}
                </nav>
            </section>
        );
    }
});
React.render(<GalleryByReactApp />, document.getElementById('content')); // jshint ignore:line

module.exports = GalleryByReactApp;
