import React, { Component, Fragment } from 'react'
import { Upload, Icon, Button } from 'antd'
import { qiniuMeta } from '@store'
import { randomFileName } from '@utils'

export default class FileUpload extends Component {
  static defaultProps = {
    multiple: true,
    listType: 'picture-card',
    accept: 'image/*, audio/mpeg, audio/ogg, audio/wav, video/*, text/*, application/*',
  }

  componentWillMount() {
    if (!qiniuMeta.isFulfilled && !qiniuMeta.isFetching) qiniuMeta.fetchData()
  }

  get uploadProps() {
    return {
      name: 'file',
      action: 'https://up-z2.qiniup.com',
      headers: {
        enctype: 'multipart/form-data',
      },
      data(file) {
        return {
          key: 'image/' + randomFileName(file.name),
          token: qiniuMeta.uptoken
        }
      }
    }
  }

  renderUploadButton = () => {
    const { listType } = this.props
    return listType === 'picture-card' ? (
      <Fragment>
        <Icon type="plus" style={{ fontSize: 20 }}/>
        <div className="ant-upload-text">上传</div>
      </Fragment>
    ) : (
      <Button icon="upload">上传</Button>
    )
  }

  render() {
    const { children = this.renderUploadButton() } = this.props

    return (
      <Upload {...this.uploadProps} {...this.props} children={children}/>
    )
  }
}
