import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  loadModels,
  getFullFaceDescription,
  isFaceDetectionModelLoaded
} from '../../api/face';

import DrawBox from '../../components/draw-box';
import ShowDescriptors from '../../components/show-descriptors';

const MaxWidth = 600;
const boxColor = '#BE80B5';
const testImg = require('../../img/test.jpg');

const INIT_STATE = {
  url: null,
  imageURL: null,
  fullDesc: null,
  imageDimension: null,
  error: null,
  loading: false
};


class ChristmasHat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...INIT_STATE,
      faceMatcher: null,
      showDescriptors: false,
      WIDTH: null,
      HEIGHT: 0,
      isModelLoaded: !!isFaceDetectionModelLoaded()
    };
  }

  componentDidMount() {
    this.resetState();
    let _W = document.documentElement.clientWidth;
    if (_W > MaxWidth) _W = MaxWidth;
    this.setState({ WIDTH: _W });
    this.mounting();
  }

  mounting = async () => {
    await loadModels();
    await this.getImageDimension(testImg);
    await this.setState({ imageURL: testImg, loading: true });
    await this.handleImageChange(testImg);
  };

  resetState = () => {
    this.setState({ ...INIT_STATE });
  };

  handleFileChange = async event => {
    this.resetState();
    await this.setState({
      imageURL: URL.createObjectURL(event.target.files[0]),
      loading: true
    });
    this.handleImageChange();
  };

  handleImageChange = async (image = this.state.imageURL) => {
    await this.getImageDimension(image);
    await getFullFaceDescription(image).then(fullDesc => {
      this.setState({ fullDesc, loading: false });
    });
  };

  getImageDimension = imageURL => {
    let img = new Image();
    img.onload = () => {
      let HEIGHT = (this.state.WIDTH * img.height) / img.width;
      this.setState({
        HEIGHT,
        imageDimension: {
          width: img.width,
          height: img.height
        }
      });
    };
    img.src = imageURL;
  };

  render() {
    const {
      WIDTH,
      HEIGHT,
      imageURL,
      fullDesc,
      faceMatcher,
      showDescriptors,
      isModelLoaded,
      error,
      loading
    } = this.state;

    // Display working status
    let status = <p>状态：面部识别库加载中 {isModelLoaded.toString()}</p>;
    if (!!error && error.toString() === 'TypeError: Failed to fetch') {
      status = (
        <p style={{ color: 'red' }}>Status: Error Failed to fetch Image URL</p>
      );
    } else if (loading) {
      status = <p style={{ color: 'blue' }}>状态：加载中</p>;
    } else if (!!fullDesc && !!imageURL && !loading) {
      if (fullDesc.length > 0) {
        status = <p>状态: 识别到{fullDesc.length}个人脸</p>;
      }

    }

    // Loading Spinner
    let spinner = (
      <div
        style={{
          margin: 0,
          color: '#BE80B5',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          textShadow: '2px 2px 3px #fff'
        }}
      >
        <div className="loading" />
        <h3>Processing...</h3>
      </div>
    );

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {status}
        <div
          style={{
            position: 'relative',
            width: WIDTH,
            height: HEIGHT
          }}
        >
          {!!imageURL ? (
            <div
              style={{
                position: 'relative'
              }}
            >
              <div style={{ position: 'absolute' }}>
                <img style={{ width: WIDTH }} src={imageURL} alt="imageURL" />
              </div>
              {!!fullDesc ? (
                <DrawBox
                  fullDesc={fullDesc}
                  faceMatcher={faceMatcher}
                  imageWidth={WIDTH}
                  boxColor={boxColor}
                />
              ) : null}
            </div>
          ) : null}
          {loading ? spinner : null}
        </div>
        <div
          style={{
            width: WIDTH,
            padding: 10,
            border: 'solid',
            marginTop: 10
          }}
        >
          <p>Input Image file or URL</p>
          <input
            id="myFileUpload"
            type="file"
            onChange={this.handleFileChange}
            accept=".jpg, .jpeg, .png"
          />
          <br />
          <div className="URLInput">
            <input
              type="url"
              name="url"
              id="url"
              placeholder="Place your photo URL here (only .jpg, .jpeg, .png)"
              pattern="https://.*"
              size="30"
              onChange={this.handleURLChange}
            />
            <button onClick={this.handleButtonClick}>Upload</button>
          </div>
          {/* <div>
            <input
              name="descriptors"
              type="checkbox"
              checked={this.state.showDescriptors}
              onChange={this.handleDescriptorsCheck}
            />
            <label>Show Descriptors</label>
          </div> */}
          {!!showDescriptors ? <ShowDescriptors fullDesc={fullDesc} /> : null}
        </div>
      </div>
    );
  }
}

export default withRouter(ChristmasHat);